<template>
  <div>
    <page-header title="Categories">
      <template #actions>
        <n-button type="primary" @click="handleAdd">Add Category</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="categories"
          :bordered="false"
          :single-line="false"
          remote
        />
      </n-spin>
    </div>
  </div>

  <category-form-modal 
    v-model:show="showModal"
    :category="currentCategory?.attributes || null"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import type { StrapiEntity } from '@/types/strapi';
import type { Category } from '@/types/category';
import {
  NButton,
  NSpace,
  NDataTable,
  NSpin,
  useMessage,
  useDialog,
  type DataTableColumns,
} from 'naive-ui';
import { CreateOutline as IconEdit, TrashOutline as IconTrash } from '@vicons/ionicons5';
import CategoryFormModal from './CategoryFormModal.vue';

const message = useMessage();
const dialog = useDialog();
const loading = ref(true);
const categories = ref<StrapiEntity<Category>[]>([]);

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await getCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    message.error('Failed to fetch categories.');
  } finally {
    loading.value = false;
  }
};

const createColumns = (): DataTableColumns<StrapiEntity<Category>> => [
  {
    title: 'ID',
    key: 'id',
    width: 100,
  },
  {
    title: 'Name',
    key: 'attributes.name',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render(row) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              { size: 'small', onClick: () => handleEdit(row) },
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
const currentCategory = ref<Partial<StrapiEntity<Category>> | null>(null);

onMounted(() => {
  fetchCategories();
});

const handleAdd = () => {
  currentCategory.value = {};
  showModal.value = true;
};

const handleEdit = (row: StrapiEntity<Category>) => {
  currentCategory.value = row;
  showModal.value = true;
};

const handleDelete = (row: StrapiEntity<Category>) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the category "${row.attributes.name}"?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await deleteCategory(row.documentId);
        message.success('Category deleted successfully!');
        fetchCategories(); // Refresh list
      } catch (error) {
        console.error('Error deleting category:', error);
        message.error('Failed to delete category. Please try again.');
      }
    },
  });
};

const handleSave = async (formData: Category) => {
  try {
    if (currentCategory.value?.documentId) {
      // Update existing category
      await updateCategory(currentCategory.value.documentId, formData);
      message.success('Category updated successfully!');
    } else {
      // Create new category
      await createCategory(formData);
      message.success('Category created successfully!');
    }
    showModal.value = false;
    fetchCategories(); // Refresh list
  } catch (error) {
    const action = currentCategory.value?.documentId ? 'updating' : 'creating';
    console.error(`Error ${action} category:`, error);
    message.error(`Failed to save category. Please try again.`);
  }
};
</script>
