<template>
  <div>
    <page-header title="Sales">
      <template #actions>
        <n-button type="primary" @click="goToNewSale">New Sale</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-card :bordered="false">
        <n-data-table
          :columns="columns"
          :data="sales"
          :loading="loading"
          :bordered="false"
        />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { getSales, deleteSale } from '@/services/saleService';
import type { StrapiEntity } from '@/types/strapi';
import type { Sale } from '@/types/sale';
import type { Customer } from '@/types/customer';
import { NButton, NDataTable, NCard, useMessage, useDialog, NIcon, NSpace } from 'naive-ui';
import { EyeOutline as IconView, TrashOutline as IconDelete } from '@vicons/ionicons5';

const router = useRouter();
const message = useMessage();
const dialog = useDialog();

const loading = ref(true);
const sales = ref<StrapiEntity<Sale>[]>([]);

const fetchSales = async () => {
  loading.value = true;
  try {
    const response = await getSales();
    sales.value = response.data;
  } catch (error) {
    console.error('Failed to fetch sales:', error);
    message.error('Failed to load sales.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSales();
});

const goToNewSale = () => {
  router.push({ name: 'NewSale' });
};

const handleView = (documentId: string) => {
  router.push({ name: 'SaleDetail', params: { documentId } });
};

const handleDelete = (documentId: string) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: 'Are you sure you want to delete this sale?',
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await deleteSale(documentId);
        message.success('Sale deleted successfully.');
        fetchSales(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete sale:', error);
        message.error('Failed to delete sale.');
      }
    },
  });
};

const columns = [
  { title: 'ID', key: 'documentId' },
  {
    title: 'Customer',
    key: 'customer',
    render: (row: StrapiEntity<Sale>) => {
      const customerEntity = row.attributes.customer?.data as StrapiEntity<Customer> | undefined;
      if (customerEntity) {
        return customerEntity.attributes.name;
      }
      return 'N/A';
    },
  },
  { title: 'Status', key: 'attributes.status_sale' },
  {
    title: 'Actions',
    key: 'actions',
    render: (row: StrapiEntity<Sale>) => h(NSpace, null, {
      default: () => [
        h(NButton, { size: 'small', circle: true, onClick: () => handleView(row.documentId) }, { icon: () => h(NIcon, null, { default: () => h(IconView) }) }),
        h(NButton, { size: 'small', circle: true, type: 'error', ghost: true, onClick: () => handleDelete(row.documentId) }, { icon: () => h(NIcon, null, { default: () => h(IconDelete) }) }),
      ]
    })
  },
];
</script>
