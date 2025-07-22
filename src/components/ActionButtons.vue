<template>
  <n-space>
    <n-button type="primary" size="small" @click="handleEdit">
      Edit
    </n-button>
    <n-button type="error" size="small" @click="handleDelete">
      Delete
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';

const emit = defineEmits(['edit', 'delete']);

const handleEdit = () => {
  emit('edit');
};

const handleDelete = () => {
  emit('delete');
};
</script>
