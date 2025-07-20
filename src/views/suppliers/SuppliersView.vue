<template>
  <div>
    <page-header title="Suppliers">
      <template #actions>
        <n-button type="primary" @click="handleAdd">Add Supplier</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="suppliers"
          :bordered="false"
          :single-line="false"
          remote
        />
      </n-spin>
    </div>
  </div>

  <supplier-form-modal 
    v-model:show="showModal"
    :supplier="currentSupplier?.attributes || null"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, type SupplierPayload } from '@/services/supplierService';
import type { StrapiEntity } from '@/types/strapi';
import type { Supplier } from '@/types/supplier';
import {
  NButton,
  NSpace,
  NDataTable,
  NSpin,
  useMessage,
  useDialog,
  type DataTableColumns,
  NIcon
} from 'naive-ui';
import { CreateOutline as IconEdit, TrashOutline as IconTrash } from '@vicons/ionicons5';
import SupplierFormModal from './SupplierFormModal.vue';

const message = useMessage();
const dialog = useDialog();
const loading = ref(true);
const suppliers = ref<StrapiEntity<Supplier>[]>([]);

const fetchSuppliers = async () => {
  loading.value = true;
  try {
    const response = await getSuppliers();
    suppliers.value = response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    message.error('Failed to fetch suppliers.');
  } finally {
    loading.value = false;
  }
};

const createColumns = (): DataTableColumns<StrapiEntity<Supplier>> => [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: 'Company Name',
    key: 'attributes.name',
  },
  {
    title: 'Contact Person',
    key: 'attributes.contact_person',
  },
  {
    title: 'Phone',
    key: 'attributes.phone',
  },
  {
    title: 'Email',
    key: 'attributes.email',
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
              { size: 'small', circle: true, ghost: true, onClick: () => handleEdit(row) },
              { icon: () => h(NIcon, null, { default: () => h(IconEdit) }) }
            ),
            h(
              NButton,
              { size: 'small', circle: true, type: 'error', ghost: true, onClick: () => handleDelete(row) },
              { icon: () => h(NIcon, null, { default: () => h(IconTrash) }) }
            ),
          ],
        }
      );
    },
  },
];

const columns = createColumns();

const showModal = ref(false);
const currentSupplier = ref<Partial<StrapiEntity<Supplier>> | null>(null);

onMounted(() => {
  fetchSuppliers();
});

const handleAdd = () => {
  currentSupplier.value = {};
  showModal.value = true;
};

const handleEdit = (row: StrapiEntity<Supplier>) => {
  currentSupplier.value = row;
  showModal.value = true;
};

const handleDelete = (row: StrapiEntity<Supplier>) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the supplier "${row.attributes.name}"?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await deleteSupplier(row.documentId);
        message.success('Supplier deleted successfully!');
        fetchSuppliers(); // Refresh list
      } catch (error) {
        console.error('Error deleting supplier:', error);
        message.error('Failed to delete supplier. Please try again.');
      }
    },
  });
};

const handleSave = async (formData: SupplierPayload) => {
  try {
    if (currentSupplier.value?.documentId) {
      // Update existing supplier
      await updateSupplier(currentSupplier.value.documentId, formData);
      message.success('Supplier updated successfully!');
    } else {
      // Create new supplier
      await createSupplier(formData);
      message.success('Supplier created successfully!');
    }
    showModal.value = false;
    fetchSuppliers(); // Refresh list
  } catch (error) {
    const action = currentSupplier.value?.documentId ? 'updating' : 'creating';
    console.error(`Error ${action} supplier:`, error);
    message.error(`Failed to save supplier. Please try again.`);
  }
};
</script>
