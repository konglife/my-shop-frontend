<template>
  <div>
    <page-header :title="pageTitle">
      <template #actions>
        <n-button type="primary" @click="handleEdit">Edit</n-button>
        <n-button type="error" @click="handleDelete">Delete</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-card v-if="loading" title="Loading Details">
        <n-skeleton text :repeat="3" />
      </n-card>

      <n-alert v-else-if="error" title="Error" type="error">
        Failed to load category details. {{ error.message }}
      </n-alert>

      <n-card v-else-if="category" title="Category Details" :bordered="false">
        <n-grid :cols="2" :x-gap="24" :y-gap="20">
          <n-gi>
            <n-text depth="3">Name</n-text>
            <div class="text-lg font-semibold">{{ category.name }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">Numeric ID</n-text>
            <div class="text-lg">{{ category.numericId }}</div>
          </n-gi>
          <n-gi :span="2">
            <n-text depth="3">Document ID</n-text>
            <div>{{ category.id }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">Created At</n-text>
            <div>{{ new Date(category.createdAt).toLocaleString() }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">Updated At</n-text>
            <div>{{ new Date(category.updatedAt).toLocaleString() }}</div>
          </n-gi>
        </n-grid>
      </n-card>
    </div>

    <category-form-modal
      v-if="category"
      v-model:show="showModal"
      :category="category"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import PageHeader from '@/components/PageHeader.vue';
import CategoryFormModal from './CategoryFormModal.vue';
import type { Category } from '@/types/category';
import { NButton, NCard, NSkeleton, NAlert, useMessage, useDialog, NGrid, NGi, NText } from 'naive-ui';

interface CategoryDetail {
  id: string;
  name: string;
  numericId: number;
  createdAt: string;
  updatedAt: string;
}

const route = useRoute();
const router = useRouter();
const message = useMessage();
const dialog = useDialog();

const category = ref<CategoryDetail | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const showModal = ref(false);

const pageTitle = computed(() => {
  if (loading.value) return 'Loading Category...';
  if (error.value) return 'Error';
  return `Category: ${category.value?.name || 'Details'}`;
});

const fetchCategoryDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    const documentId = route.params.id as string;
    const response = await getCategory(documentId);
    const flatItem = response.data as any;
    // This transformation is based on the non-standard API response
    category.value = {
      id: flatItem.documentId,
      name: flatItem.name,
      numericId: flatItem.id,
      createdAt: flatItem.createdAt,
      updatedAt: flatItem.updatedAt,
    };
  } catch (err) {
    error.value = err as Error;
    message.error('Failed to fetch category details.');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategoryDetails);

const handleEdit = () => {
  if (!category.value) return;
  showModal.value = true;
};

const handleSave = async (formData: Partial<CategoryDetail>) => {
  if (!category.value) return;

  const payload: Category = {
    name: formData.name || '',
  };

  try {
    await updateCategory(category.value.id, payload);
    message.success('Category updated successfully!');
    showModal.value = false;
    await fetchCategoryDetails(); // Refresh data
  } catch (err) {
    message.error('Failed to update category.');
    console.error(err);
  }
};

const handleDelete = () => {
  if (!category.value) return;

  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the category "${category.value.name}"?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      if (!category.value) return;
      try {
        await deleteCategory(category.value.id);
        message.success('Category deleted successfully!');
        router.push({ name: 'Categories' });
      } catch (err) {
        message.error('Failed to delete category.');
        console.error(err);
      }
    },
  });
};
</script>
