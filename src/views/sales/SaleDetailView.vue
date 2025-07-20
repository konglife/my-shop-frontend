<template>
  <div>
    <page-header :title="isEdit ? 'Edit Sale' : 'New Sale'">
      <template #actions>
        <n-button @click="handleCancel">Cancel</n-button>
        <n-button type="primary" class="ml-2" @click="handleSave">Save Sale</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-grid :x-gap="24" :cols="1">
          <n-gi>
            <n-card title="Sale Details">
              <n-form ref="formRef" :model="model">
                <n-form-item path="customer" label="Customer">
                    <n-select 
                      v-model:value="model.customer" 
                      :options="customerOptions" 
                      filterable
                      clearable
                      placeholder="Select a customer or leave blank for cash sale"
                    />
                </n-form-item>
              </n-form>
            </n-card>

            <n-card title="Sale Items" class="mt-4">
              <n-data-table
                :columns="itemColumns"
                :data="model.sale_items"
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
import { useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { getSale, createSale, updateSale, type SalePayload, type SaleItemPayload } from '@/services/saleService';
import { getCustomers } from '@/services/customerService';
import { getProducts } from '@/services/productService';
import type { StrapiEntity } from '@/types/strapi';
import type { Customer } from '@/types/customer';
import type { Product } from '@/types/product';
import {
  NButton, NSpin, NGrid, NGi, NCard, NForm, NFormItem, NSelect, NDataTable, useMessage, NInputNumber, NIcon, type DataTableColumns
} from 'naive-ui';
import { TrashOutline as IconTrash } from '@vicons/ionicons5';

const props = defineProps<{ documentId?: string }>();

const router = useRouter();
const message = useMessage();

const loading = ref(true);
const isEdit = computed(() => !!props.documentId);

const customers = ref<StrapiEntity<Customer>[]>([]);
const products = ref<StrapiEntity<Product>[]>([]);

const model = ref<Partial<SalePayload>>({
  customer: null,
  status_sale: 'DRAFT',
  sale_items: [],
});

const customerOptions = computed(() => 
  customers.value.map((c: StrapiEntity<Customer>) => ({ label: c.attributes.name, value: c.documentId }))
);

const productOptions = computed(() => 
  products.value.map((p: StrapiEntity<Product>) => ({ label: `${p.attributes.name} (Stock: ${p.attributes.stock?.data?.attributes.quantity || 0})`, value: p.documentId }))
);

const fetchRequiredData = async () => {
  try {
    const [customerRes, productRes] = await Promise.all([
      getCustomers(),
      getProducts({ populate: ['stock'] }) // Populate stock for display
    ]);
    customers.value = customerRes.data;
    products.value = productRes.data;

    if (isEdit.value) {
      const saleRes = await getSale(props.documentId!);
      const saleData = saleRes.data.attributes;
      model.value = {
        ...saleData,
        customer: saleData.customer?.data?.documentId,
        sale_items: saleData.sale_items?.data?.map((item: StrapiEntity<any>) => ({
          product: item.attributes.product?.data?.documentId ?? '',
          quantity: item.attributes.quantity,
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

const itemColumns = computed((): DataTableColumns<SaleItemPayload> => [
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
          model.value.sale_items![index].product = value;
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
          model.value.sale_items![index].quantity = value ?? 1;
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
  if (!model.value.sale_items) {
    model.value.sale_items = [];
  }
  model.value.sale_items.push({
    product: '',
    quantity: 1,
  });
};

const handleRemoveItem = (index: number) => {
  model.value.sale_items?.splice(index, 1);
};

const handleSave = async () => {
  const items = model.value.sale_items || [];
  if (items.length === 0) {
    message.error('Please add at least one item to the sale.');
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
    const payload: SalePayload = {
      customer: model.value.customer || null,
      status_sale: model.value.status_sale || 'DRAFT',
      sale_items: items,
    };

    if (isEdit.value) {
      await updateSale(props.documentId!, payload);
      message.success('Sale updated successfully!');
    } else {
      await createSale(payload);
      message.success('Sale created successfully!');
    }
    router.push({ name: 'Sales' });
  } catch (error) {
    console.error('Failed to save sale:', error);
    message.error('Failed to save sale.');
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push({ name: 'Sales' });
};
</script>
