<template>
  <div>
    <page-header title="Units">
      <template #actions>
        <n-button type="primary" @click="handleAdd">Add Unit</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <data-table-wrapper
        :loading="loading"
        :error="error"
        :data="items"
        :columns="columns"
      />
    </div>

    <unit-form-modal
      v-model:show="showModal"
      :unit="currentItemForModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, type DataTableColumns } from 'naive-ui';
import PageHeader from '@/components/PageHeader.vue';
import DataTableWrapper from '@/components/DataTableWrapper.vue';
import ActionButtons from '@/components/ActionButtons.vue';
import UnitFormModal from './UnitFormModal.vue';
import { getUnits, createUnit, updateUnit, deleteUnit } from '@/services/unitService';
import { useCrud, type ViewItem } from '@/composables/useCrud';
import type { Unit } from '@/types/unit';

// This interface must align with the ViewItem interface from useCrud
interface FlatUnit extends ViewItem {
  numericId: number;
  name: string;
}

const router = useRouter();

// Local state for modal and selected item
const showModal = ref(false);
const currentItemId = ref<string | null>(null); // Store documentId for editing

// Create a service object that matches the CrudService interface
const unitCrudService = {
  getAll: getUnits,
  create: createUnit,
  update: updateUnit,
  remove: deleteUnit,
};

// Use the CRUD composable with correct types and service object
const {
  loading,
  items,
  error,
  fetchItems,
  saveItem,
  deleteItem,
} = useCrud<FlatUnit, Unit, Unit, Partial<Unit>>(unitCrudService, {
  itemName: 'Unit',
});

const currentItemForModal = computed(() => {
    if (!currentItemId.value) return null;
    const item = items.value.find(i => i.id === currentItemId.value);
    // We need to find the original attributes, not the flattened item
    // This requires a different approach, let's find it in the raw data if possible
    // For now, we'll just pass the flat item, the modal needs to handle it
    return item ? { name: item.name } : null;
});


// Local handlers for UI interactions
const handleAdd = () => {
  currentItemId.value = null;
  showModal.value = true;
};

const handleEdit = (item: FlatUnit) => {
  currentItemId.value = item.id; // Store the documentId
  showModal.value = true;
};

const handleSave = async (formData: Unit) => {
  await saveItem(formData, currentItemId.value ?? undefined);
  showModal.value = false;
  fetchItems();
};

const columns: DataTableColumns<FlatUnit> = [
  {
    title: 'ID',
    key: 'numericId',
    width: 100,
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    align: 'center',
    render(row) {
      return h(ActionButtons, {
        onView: () => router.push({ name: 'UnitDetails', params: { id: row.id } }),
        onEdit: () => handleEdit(row),
        onDelete: () => deleteItem(row), // 'row' now conforms to ViewItem
      });
    },
  },
];
</script>
