<template>
  <div>
    <page-header title="Customers">
      <template #actions>
        <n-button type="primary" @click="handleAdd">Add Customer</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="customers"
          :bordered="false"
          :single-line="false"
          remote
        />
      </n-spin>
    </div>
  </div>

  <customer-form-modal 
    v-model:show="showModal"
    :customer="currentCustomer?.attributes || null"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, type CustomerPayload } from '@/services/customerService';
import type { StrapiEntity } from '@/types/strapi';
import type { Customer } from '@/types/customer';
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
import CustomerFormModal from './CustomerFormModal.vue';

const message = useMessage();
const dialog = useDialog();
const loading = ref(true);
const customers = ref<StrapiEntity<Customer>[]>([]);

const fetchCustomers = async () => {
  loading.value = true;
  try {
    const response = await getCustomers();
    customers.value = response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    message.error('Failed to fetch customers.');
  } finally {
    loading.value = false;
  }
};

const createColumns = (): DataTableColumns<StrapiEntity<Customer>> => [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: 'Name',
    key: 'attributes.name',
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
const currentCustomer = ref<Partial<StrapiEntity<Customer>> | null>(null);

onMounted(() => {
  fetchCustomers();
});

const handleAdd = () => {
  currentCustomer.value = {};
  showModal.value = true;
};

const handleEdit = (row: StrapiEntity<Customer>) => {
  currentCustomer.value = row;
  showModal.value = true;
};

const handleDelete = (row: StrapiEntity<Customer>) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete the customer "${row.attributes.name}"?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await deleteCustomer(row.documentId);
        message.success('Customer deleted successfully!');
        fetchCustomers(); // Refresh list
      } catch (error) {
        console.error('Error deleting customer:', error);
        message.error('Failed to delete customer. Please try again.');
      }
    },
  });
};

const handleSave = async (formData: CustomerPayload) => {
  try {
    if (currentCustomer.value?.documentId) {
      // Update existing customer
      await updateCustomer(currentCustomer.value.documentId, formData);
      message.success('Customer updated successfully!');
    } else {
      // Create new customer
      await createCustomer(formData);
      message.success('Customer created successfully!');
    }
    showModal.value = false;
    fetchCustomers(); // Refresh list
  } catch (error) {
    const action = currentCustomer.value?.documentId ? 'updating' : 'creating';
    console.error(`Error ${action} customer:`, error);
    message.error(`Failed to save customer. Please try again.`);
  }
};
</script>
