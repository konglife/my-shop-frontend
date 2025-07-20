<template>
  <div>
    <page-header title="Units">
      <template #actions>
        <n-button type="primary" @click="handleAdd">Add Unit</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="units"
          :bordered="false"
          :single-line="false"
          remote
        />
      </n-spin>
    </div>
  </div>

  <unit-form-modal 
    v-model:show="showModal"
    :unit="currentUnit?.attributes || null"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { getUnits, createUnit, updateUnit, deleteUnit } from '@/services/unitService';
import type { StrapiEntity } from '@/types/strapi';
import type { Unit } from '@/types/unit';
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
import UnitFormModal from './UnitFormModal.vue';

const message = useMessage();
const dialog = useDialog();
const loading = ref(true);
const units = ref<StrapiEntity<Unit>[]>([]);

const fetchUnits = async () => {
  loading.value = true;
  try {
    const response = await getUnits();
    units.value = response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    message.error('Failed to fetch units.');
  } finally {
    loading.value = false;
  }
};

const createColumns = (): DataTableColumns<StrapiEntity<Unit>> => [
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
const currentUnit = ref<Partial<StrapiEntity<Unit>> | null>(null);

onMounted(() => {
  fetchUnits();
});

const handleAdd = () => {
  currentUnit.value = {};
  showModal.value = true;
};

const handleEdit = (row: StrapiEntity<Unit>) => {
  currentUnit.value = row;
  showModal.value = true;
};

const handleDelete = (row: StrapiEntity<Unit>) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the unit "${row.attributes.name}"?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await deleteUnit(row.documentId);
        message.success('Unit deleted successfully!');
        fetchUnits(); // Refresh list
      } catch (error) {
        console.error('Error deleting unit:', error);
        message.error('Failed to delete unit. Please try again.');
      }
    },
  });
};

const handleSave = async (formData: Unit) => {
  try {
    if (currentUnit.value?.documentId) {
      // Update existing unit
      await updateUnit(currentUnit.value.documentId, formData);
      message.success('Unit updated successfully!');
    } else {
      // Create new unit
      await createUnit(formData);
      message.success('Unit created successfully!');
    }
    showModal.value = false;
    fetchUnits(); // Refresh list
  } catch (error) {
    const action = currentUnit.value?.documentId ? 'updating' : 'creating';
    console.error(`Error ${action} unit:`, error);
    message.error(`Failed to save unit. Please try again.`);
  }
};
</script>
