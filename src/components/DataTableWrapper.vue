<template>
  <div v-if="loading" class="flex justify-center items-center p-8">
    <n-spin size="large" />
  </div>

  <div v-else-if="error" class="flex flex-col items-center justify-center p-8 text-center">
    <n-icon :component="IconAlert" size="40" class="mb-4 text-red-500" />
    <h3 class="text-lg font-medium mb-2">เกิดข้อผิดพลาด</h3>
    <p class="text-gray-500 mb-4">{{ error.message || 'ไม่สามารถโหลดข้อมูลได้' }}</p>
    <n-button type="primary" ghost @click="$emit('retry')">
      <template #icon>
        <n-icon :component="IconRefresh" />
      </template>
      ลองอีกครั้ง
    </n-button>
  </div>

  <n-data-table v-else :columns="columns" :data="data" v-bind="$attrs">
    <template #empty>
      <div class="flex flex-col items-center justify-center p-8 text-center">
        <n-icon :component="IconEmpty" size="40" class="mb-4 text-gray-400" />
        <p class="text-gray-500">ไม่พบข้อมูล</p>
      </div>
    </template>
  </n-data-table>
</template>

<script setup lang="ts">
import { NSpin, NDataTable, NButton, NIcon } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { 
  AlertCircleOutline as IconAlert, 
  RefreshOutline as IconRefresh,
  ArchiveOutline as IconEmpty
} from '@vicons/ionicons5';

defineProps<{
  loading: boolean;
  error: Error | null;
  data: any[];
  columns: DataTableColumns<any>;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
