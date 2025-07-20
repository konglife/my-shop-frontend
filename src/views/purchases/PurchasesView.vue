<template>
  <div>
    <page-header title="Purchases">
      <template #actions>
        <n-button type="primary" @click="handleAddNew">Add Purchase</n-button>
      </template>
    </page-header>

    <div class="p-4">
      <n-spin :show="loading">
        <n-data-table
          :columns="columns"
          :data="purchases"
          :bordered="false"
          :single-line="false"
          remote
        />
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/PageHeader.vue';
import { getPurchases, deletePurchase } from '@/services/purchaseService';
import type { StrapiEntity } from '@/types/strapi';
import type { Purchase } from '@/types/purchase';
import {
  NButton,
  NSpace,
  NDataTable,
  NSpin,
  useMessage,
  useDialog,
  type DataTableColumns,
  NIcon,
  NTag
} from 'naive-ui';
import { EyeOutline as IconView, TrashOutline as IconTrash } from '@vicons/ionicons5';

const router = useRouter();
const message = useMessage();
const dialog = useDialog();
const loading = ref(true);
const purchases = ref<StrapiEntity<Purchase>[]>([]);

const fetchPurchases = async () => {
  loading.value = true;
  try {
    const response = await getPurchases();
    purchases.value = response.data;
  } catch (error) {
    console.error('Error fetching purchases:', error);
    message.error('Failed to fetch purchases.');
  } finally {
    loading.value = false;
  }
};

const getStatusType = (status: string) => {
  switch (status) {
    case 'RECEIVED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const createColumns = (): DataTableColumns<StrapiEntity<Purchase>> => [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: 'Supplier',
    key: 'attributes.supplier.data.attributes.name',
  },
  {
    title: 'Order Date',
    key: 'attributes.order_date',
    render: (row) => row.attributes.order_date ? new Date(row.attributes.order_date).toLocaleDateString() : 'N/A',
  },
  {
    title: 'Status',
    key: 'attributes.status_purchase',
    render(row) {
      return h(
        NTag,
        { type: getStatusType(row.attributes.status_purchase), bordered: false },
        { default: () => row.attributes.status_purchase }
      );
    },
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
              { size: 'small', circle: true, ghost: true, onClick: () => handleView(row) },
              { icon: () => h(NIcon, null, { default: () => h(IconView) }) }
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

onMounted(() => {
  fetchPurchases();
});

const handleAddNew = () => {
  router.push({ name: 'PurchaseNew' });
};

const handleView = (row: StrapiEntity<Purchase>) => {
  router.push({ name: 'PurchaseEdit', params: { documentId: row.documentId } });
};

const handleDelete = (row: StrapiEntity<Purchase>) => {
  dialog.warning({
    title: 'Confirm Deletion',
    content: `Are you sure you want to delete Purchase #${row.id}?`,
    positiveText: 'Yes, Delete',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      try {
        await deletePurchase(row.documentId);
        message.success('Purchase deleted successfully!');
        fetchPurchases(); // Refresh list
      } catch (error) {
        console.error('Error deleting purchase:', error);
        message.error('Failed to delete purchase. Please try again.');
      }
    },
  });
};
</script>
