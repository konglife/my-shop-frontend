<template>
  <div>
    <page-header :title="isEdit ? 'Edit Purchase' : 'New Purchase'">
      <template #actions>
        <n-button @click="handleCancel">Cancel</n-button>
        <n-button type="primary" class="ml-2" @click="handleSave">Save Purchase</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-grid :x-gap="24" :cols="1">
          <n-gi>
            <n-card title="Purchase Details">
              <n-form ref="formRef" :model="model">
                <n-grid :x-gap="24" :cols="2">
                  <n-gi>
                    <n-form-item path="supplier" label="Supplier">
                       <n-select 
                          v-model:value="model.supplier" 
                          :options="supplierOptions" 
                          filterable
                          placeholder="Select a supplier"
                        />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item path="order_date" label="Order Date">
                       <n-date-picker v-model:formatted-value="model.order_date" type="date" class="w-full" />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </n-form>
            </n-card>

            <n-card title="Purchase Items" class="mt-4">
              <n-data-table
                :columns="itemColumns"
                :data="model.purchase_items"
                :bordered="false"
              />
              <n-button class="mt-4" @click="handleAddItem">Add Item</n-button>
            </n-card>

          </n-gi>
        </n-grid>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { getPurchase, createPurchase, updatePurchase, type PurchasePayload, type PurchaseItemPayload } from '@/services/purchaseService';
import { getSuppliers } from '@/services/supplierService';
import { getProducts } from '@/services/productService';
import type { StrapiEntity } from '@/types/strapi';
import type { Supplier } from '@/types/supplier';
import type { Product } from '@/types/product';
import {
  NButton, NSpin, NGrid, NGi, NCard, NForm, NFormItem, NSelect, NDatePicker, NDataTable, useMessage, NInputNumber, NIcon, type DataTableColumns
} from 'naive-ui';
import { TrashOutline as IconTrash } from '@vicons/ionicons5';

const props = defineProps<{ documentId?: string }>();

const router = useRouter();
const message = useMessage();
const loading = ref(true);
const isEdit = computed(() => !!props.documentId);

const model = ref<Partial<PurchasePayload>>({
  status_purchase: 'PENDING',
  purchase_items: [],
});

const suppliers = ref<StrapiEntity<Supplier>[]>([]);
const products = ref<StrapiEntity<Product>[]>([]);

const supplierOptions = computed(() => 
  suppliers.value.map(s => ({ label: s.attributes.name, value: s.documentId }))
);

const productOptions = computed(() => 
  products.value.map(p => ({ label: p.attributes.name, value: p.documentId }))
);

const fetchRequiredData = async () => {
  try {
    const [supplierRes, productRes] = await Promise.all([
      getSuppliers(),
      getProducts({ populate: '*' })
    ]);
    suppliers.value = supplierRes.data;
    products.value = productRes.data;

    if (isEdit.value) {
      const purchaseRes = await getPurchase(props.documentId!);
      const purchaseData = purchaseRes.data.attributes;
      model.value = {
        ...purchaseData,
        supplier: purchaseData.supplier?.data?.documentId,
        purchase_items: purchaseData.purchase_items?.data.map(item => ({
          product: item.attributes.product?.data?.documentId ?? '',
          quantity: item.attributes.quantity,
          unit_price: item.attributes.unit_price,
          id: item.id
        })) || []
      };
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    message.error('Failed to load required data.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRequiredData();
});

const itemColumns = computed((): DataTableColumns<PurchaseItemPayload> => [
  {
    title: 'Product',
    key: 'product',
    render(row, index) {
      return h(NSelect, {
        value: row.product,
        options: productOptions.value,
        filterable: true,
        placeholder: 'Select Product',
        onUpdateValue: (value) => {
          model.value.purchase_items![index].product = value;
        },
      });
    },
  },
  {
    title: 'Quantity',
    key: 'quantity',
    width: 150,
    render(row, index) {
      return h(NInputNumber, {
        value: row.quantity,
        min: 1,
        placeholder: 'Qty',
        onUpdateValue: (value) => {
          model.value.purchase_items![index].quantity = value ?? 1;
        },
      });
    },
  },
  {
    title: 'Unit Price',
    key: 'unit_price',
    width: 180,
    render(row, index) {
      return h(NInputNumber, {
        value: row.unit_price,
        min: 0,
        step: 0.01,
        placeholder: 'Price',
        onUpdateValue: (value) => {
          model.value.purchase_items![index].unit_price = value ?? 0;
        },
      });
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    align: 'center',
    render(_, index) {
      return h(
        NButton,
        {
          size: 'small',
          circle: true,
          type: 'error',
          ghost: true,
          onClick: () => handleRemoveItem(index),
        },
        { icon: () => h(NIcon, null, { default: () => h(IconTrash) }) }
      );
    },
  },
]);

const handleAddItem = () => {
  if (!model.value.purchase_items) {
    model.value.purchase_items = [];
  }
  model.value.purchase_items.push({
    product: '',
    quantity: 1,
    unit_price: 0,
  });
};

const handleRemoveItem = (index: number) => {
  model.value.purchase_items?.splice(index, 1);
};

const handleSave = async () => {
  // --- Validation ---
  if (!model.value.supplier) {
    message.error('Please select a supplier.');
    return;
  }

  const items = model.value.purchase_items || [];
  if (items.length === 0) {
    message.error('Please add at least one item to the purchase.');
    return;
  }

  for (const item of items) {
    if (!item.product) {
      message.error('Please select a product for all items.');
      return;
    }
    if (!(item.quantity > 0)) {
      message.error('Please ensure all items have a quantity greater than 0.');
      return;
    }
  }

  loading.value = true;
  try {
    const payload: PurchasePayload = {
      supplier: model.value.supplier,
      order_date: model.value.order_date,
      status_purchase: model.value.status_purchase || 'PENDING',
      purchase_items: items,
    };

    if (isEdit.value) {
      await updatePurchase(props.documentId!, payload);
      message.success('Purchase updated successfully!');
    } else {
      await createPurchase(payload);
      message.success('Purchase created successfully!');
    }
    router.push({ name: 'Purchases' });
  } catch (error) {
    console.error('Failed to save purchase:', error);
    message.error('Failed to save purchase.');
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push({ name: 'Purchases' });
};

</script>
