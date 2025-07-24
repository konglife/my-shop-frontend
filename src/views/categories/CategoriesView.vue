<template>
  <div>
    <page-header title="Categories">
      <template #actions>
        <n-button type="primary" @click="handleAdd">Add Category</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-card title="Category List" :bordered="false" size="small">
        <data-table-wrapper
          :loading="loading"
          :error="error"
          :data="categories"
          :columns="columns"
          :bordered="false"
          :single-line="false"
          remote
          @retry="fetchCategories"
        />
      </n-card>
    </div>
  </div>

  <category-form-modal 
    v-model:show="showModal"
    :category="currentCategory || null"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { RouterLink } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import DataTableWrapper from '@/components/DataTableWrapper.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import CategoryFormModal from './CategoryFormModal.vue';
import { useCrud, type ViewItem } from '@/composables/useCrud';
import * as categoryService from '@/services/categoryService';
import type { Category } from '@/types/category';
import { NButton, NCard, type DataTableColumns } from 'naive-ui';

// Define a local type for the flattened category structure used in the view
interface FlatCategory extends ViewItem {
  name: string;
  numericId?: number; // The legacy numeric ID from Strapi attributes
}

// The API returns a non-standard flattened structure.
// This adapter transforms the flat response into the standard StrapiEntity structure
// that the useCrud composable expects.
const serviceAdapter = {
  getAll: async () => {
    const response = await categoryService.getCategories();
    const transformedData = (response.data as any[]).map(item => ({
      id: item.documentId,
      attributes: {
        numericId: item.id,
        name: item.name,
        documentId: item.documentId,
      },
    }));
    return { data: transformedData };
  },
  create: async (data: Category) => {
    const response = await categoryService.createCategory(data);
    const flatItem = response.data as any;
    return {
      id: flatItem.documentId,
      attributes: { ...flatItem, numericId: flatItem.id },
    };
  },
  update: async (id: string, data: Partial<Category>) => {
    const response = await categoryService.updateCategory(id, data);
    const flatItem = response.data as any;
    return {
      id: flatItem.documentId,
      attributes: { ...flatItem, numericId: flatItem.id },
    };
  },
  remove: (id: string) => categoryService.deleteCategory(id),
};

const {
  loading,
  items: categories,
  error,
  saveItem,
  deleteItem,
  fetchItems: fetchCategories,
} = useCrud<FlatCategory, Category, Category, Partial<Category>>(serviceAdapter, {
  itemName: 'Category',
  initialFetch: true,
});

const showModal = ref(false);
const currentCategory = ref<Partial<FlatCategory> | null>(null);

const handleAdd = () => {
  currentCategory.value = {};
  showModal.value = true;
};

const handleEdit = (category: FlatCategory) => {
  currentCategory.value = { ...category };
  showModal.value = true;
};

const handleSave = async (formData: Partial<FlatCategory>) => {
  // The backend only expects the 'name' field for a category.
  // We must strip out other fields like 'id', 'numericId' etc. that are
  // part of the frontend's FlatCategory model.
  const payload: Category = {
    name: formData.name || '',
  };
  await saveItem(payload, currentCategory.value?.id);
  showModal.value = false;
};

const createColumns = (): DataTableColumns<FlatCategory> => [
  {
    title: 'ID',
    key: 'numericId',
    width: 100,
  },
  {
    title: 'Name',
    key: 'name',
    render(row) {
      return h(
        RouterLink,
        {
          to: { name: 'CategoryDetail', params: { id: row.id } },
        },
        { default: () => row.name }
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    align: 'center',
    render(row) {
      return h(ActionButtons, {
        onEdit: () => handleEdit(row),
        onDelete: () => deleteItem(row),
      });
    },
  },
];

const columns = createColumns();
</script>
