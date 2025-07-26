<template>
  <n-space>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button type="info" quaternary circle size="small" @click="handleView">
          <template #icon>
            <n-icon><eye-outline /></n-icon>
          </template>
        </n-button>
      </template>
      View Details
    </n-tooltip>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button type="primary" quaternary circle size="small" @click="handleEdit">
          <template #icon>
            <n-icon><pencil-outline /></n-icon>
          </template>
        </n-button>
      </template>
      Edit
    </n-tooltip>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button type="error" quaternary circle size="small" @click="handleDelete">
          <template #icon>
            <n-icon><trash-outline /></n-icon>
          </template>
        </n-button>
      </template>
      Delete
    </n-tooltip>
  </n-space>
</template>

<script setup lang="ts">
import { NButton, NSpace, NTooltip, NIcon } from 'naive-ui';
import { EyeOutline, PencilOutline, TrashOutline } from '@vicons/ionicons5';

const emit = defineEmits(['view', 'edit', 'delete']);

const handleView = () => {
  emit('view');
};

const handleEdit = () => {
  emit('edit');
};

const handleDelete = () => {
  emit('delete');
};
</script>
