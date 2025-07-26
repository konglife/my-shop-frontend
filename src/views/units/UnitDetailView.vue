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
        Failed to load unit details. {{ error.message }}
      </n-alert>

      <n-card v-else-if="unit" title="Unit Details" :bordered="false">
        <n-grid :cols="2" :x-gap="24" :y-gap="20">
          <n-gi>
            <n-text depth="3">Name</n-text>
            <div class="text-lg font-semibold">{{ unit.name }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">Numeric ID</n-text>
            <div class="text-lg">{{ unit.numericId }}</div>
          </n-gi>
          <n-gi :span="2">
            <n-text depth="3">Document ID</n-text>
            <div>{{ unit.id }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">Created At</n-text>
            <div>{{ new Date(unit.createdAt).toLocaleString() }}</div>
          </n-gi>
          <n-gi>
            <n-text depth="3">Updated At</n-text>
            <div>{{ new Date(unit.updatedAt).toLocaleString() }}</div>
          </n-gi>
        </n-grid>
      </n-card>
    </div>

    <unit-form-modal
      v-if="unit"
      v-model:show="showModal"
      :unit="unit"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUnit, updateUnit, deleteUnit } from '@/services/unitService';
import PageHeader from '@/components/PageHeader.vue';
import UnitFormModal from './UnitFormModal.vue';
import type { Unit } from '@/types/unit';
import { NButton, NCard, NSkeleton, NAlert, useMessage, useDialog, NGrid, NGi, NText } from 'naive-ui';

interface UnitDetail {
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

const unit = ref<UnitDetail | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);
const showModal = ref(false);

const pageTitle = computed(() => {
  if (loading.value) return 'Loading Unit...';
  if (error.value) return 'Error';
  return `Unit: ${unit.value?.name || 'Details'}`;
});

const fetchUnitDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    const documentId = route.params.id as string;
    const response = await getUnit(documentId);
    const flatItem = response.data as any;
    unit.value = {
      id: flatItem.documentId,
      name: flatItem.name,
      numericId: flatItem.id,
      createdAt: flatItem.createdAt,
      updatedAt: flatItem.updatedAt,
    };
  } catch (err) {
    error.value = err as Error;
    message.error('Failed to fetch unit details.');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUnitDetails);

const handleEdit = () => {
  if (!unit.value) return;
  showModal.value = true;
};

const handleSave = async (formData: Partial<UnitDetail>) => {
  if (!unit.value) return;

  const payload: Unit = {
    name: formData.name || '',
  };

  try {
    await updateUnit(unit.value.id, payload);
    message.success('Unit updated successfully!');
    showModal.value = false;
    await fetchUnitDetails(); // Refresh data
  } catch (err) {
    message.error('Failed to update unit.');
    console.error(err);
  }
};

const handleDelete = () => {
  if (!unit.value) return;

  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the unit "${unit.value.name}"?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      if (!unit.value) return;
      try {
        await deleteUnit(unit.value.id);
        message.success('Unit deleted successfully!');
        router.push({ name: 'Units' });
      } catch (err) {
        message.error('Failed to delete unit.');
        console.error(err);
      }
    },
  });
};
</script>
