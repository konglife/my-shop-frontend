<template>
  <div>
    <page-header title="Categories" />

    <div class="p-4">
      <n-card :bordered="false" size="small">
        <template #header>
          <n-space align="center" justify="space-between" class="w-full">
            <span class="text-lg font-bold">Category List</span>
            <n-input
              v-model:value="searchQuery"
              placeholder="Search by name..."
              clearable
              style="width: 300px"
            />
          </n-space>
        </template>
        <template #header-extra>
          <n-button type="primary" @click="handleAdd">Add Category</n-button>
        </template>

        <data-table-wrapper
          :loading="loading"
          :error="error"
          :data="filteredCategories"
          :columns="columns"
          :bordered="false"
          :single-line="false"
          remote
          @retry="fetchCategories"
        />
        
        <template #footer>
          <div class="text-sm text-gray-500">
            Total Categories: {{ categories.length }}
          </div>
        </template>
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
import { h, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import DataTableWrapper from '@/components/DataTableWrapper.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import CategoryFormModal from './CategoryFormModal.vue';
import { useCrud, type ViewItem } from '@/composables/useCrud';
import * as categoryService from '@/services/categoryService';
import type { Category } from '@/types/category';
import { NButton, NCard, NInput, NSpace, type DataTableColumns } from 'naive-ui';

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
    // Add the required 'meta' property for StrapiResponse compatibility
    return { 
      data: transformedData,
      meta: { 
        pagination: { 
          page: 1, 
          pageSize: transformedData.length, 
          pageCount: 1, 
          total: transformedData.length 
        } 
      } 
    };
  },
  create: async (data: Category) => {
    const response = await categoryService.createCategory(data);
    const flatItem = response.data as any;
    const transformed = {
      id: flatItem.documentId,
      attributes: { ...flatItem, numericId: flatItem.id },
    };
    return { 
      data: transformed, 
      meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } } 
    };
  },
  update: async (id: string, data: Partial<Category>) => {
    const response = await categoryService.updateCategory(id, data);
    const flatItem = response.data as any;
    const transformed = {
      id: flatItem.documentId,
      attributes: { ...flatItem, numericId: flatItem.id },
    };
    return { 
      data: transformed, 
      meta: { pagination: { page: 1, pageSize: 1, pageCount: 1, total: 1 } } 
    };
  },
  remove: (id: string) => categoryService.deleteCategory(id),
};

const searchQuery = ref('');

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

const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value;
  }
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
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
