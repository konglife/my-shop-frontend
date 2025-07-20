<template>
  <div>
    <page-header title="Products">
      <template #actions>
        <n-button type="primary" @click="handleAdd">Add Product</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="products"
          :bordered="false"
          :single-line="false"
          remote
        />
      </n-spin>
    </div>
  </div>

  <product-form-modal 
    v-model:show="showModal"
    :product="currentProduct"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { getProducts, createProduct, updateProduct, deleteProduct, type ProductPayload } from '@/services/productService';
import type { StrapiEntity } from '@/types/strapi';
import type { Product } from '@/types/product';
import {
  NButton,
  NSpace,
  NDataTable,
  NSpin,
  useMessage,
  useDialog,
  NTag,
  type DataTableColumns,
} from 'naive-ui';
import { CreateOutline as IconEdit, TrashOutline as IconTrash } from '@vicons/ionicons5';
import ProductFormModal from './ProductFormModal.vue';

const message = useMessage();
const dialog = useDialog();
const loading = ref(true);
const products = ref<StrapiEntity<Product>[]>([]);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const response = await getProducts();
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    message.error('Failed to fetch products.');
  } finally {
    loading.value = false;
  }
};

const createColumns = (): DataTableColumns<StrapiEntity<Product>> => [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: 'Name',
    key: 'attributes.name',
    ellipsis: { tooltip: true },
  },
  {
    title: 'Category',
    key: 'attributes.category',
    render: (row) => {
      const categoryName = row.attributes.category?.data?.attributes.name;
      return categoryName ? h(NTag, { type: 'info', bordered: false }, { default: () => categoryName }) : 'N/A';
    },
  },
  {
    title: 'Unit',
    key: 'attributes.unit',
    render: (row) => row.attributes.unit?.data?.attributes.name ?? 'N/A',
  },
  {
    title: 'Selling Price',
    key: 'attributes.selling_price',
    align: 'right',
    render: (row) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(row.attributes.selling_price),
  },
  {
    title: 'Stock',
    key: 'attributes.stock',
    align: 'center',
    render: (row) => row.attributes.stock?.data?.attributes.quantity ?? 0,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center',
    render(row) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              { size: 'small', type: 'primary', ghost: true, onClick: () => handleEdit(row) },
              { icon: () => h(IconEdit) }
            ),
            h(
              NButton,
              { size: 'small', type: 'error', ghost: true, onClick: () => handleDelete(row) },
              { icon: () => h(IconTrash) }
            ),
          ],
        }
      );
    },
  },
];

const columns = createColumns();

const showModal = ref(false);
const currentProduct = ref<StrapiEntity<Product> | null>(null);

onMounted(() => {
  fetchProducts();
});

const handleAdd = () => {
  currentProduct.value = null;
  showModal.value = true;
};

const handleEdit = (row: StrapiEntity<Product>) => {
  currentProduct.value = row;
  showModal.value = true;
};

const handleDelete = (row: StrapiEntity<Product>) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the product "${row.attributes.name}"?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await deleteProduct(row.documentId);
        message.success('Product deleted successfully!');
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error('Error deleting product:', error);
        message.error('Failed to delete product. Please try again.');
      }
    },
  });
};

const handleSave = async (formData: ProductPayload) => {
  loading.value = true;
  try {
    if (currentProduct.value?.documentId) {
      await updateProduct(currentProduct.value.documentId, formData);
      message.success('Product updated successfully!');
    } else {
      await createProduct(formData);
      message.success('Product created successfully!');
    }
    showModal.value = false;
    await fetchProducts();
  } catch (error) {
    const action = currentProduct.value?.documentId ? 'updating' : 'creating';
    console.error(`Error ${action} product:`, error);
    message.error(`Failed to save product. Please try again.`);
  } finally {
    loading.value = false;
  }
};
</script>
