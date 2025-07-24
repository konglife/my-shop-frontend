<template>
  <div class="page-header-container">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <router-link v-if="item.path" :to="item.path">{{ item.name }}</router-link>
        <span v-else>{{ item.name }}</span>
      </n-breadcrumb-item>
    </n-breadcrumb>
    <div class="header-content">
      <n-h1 class="page-title">{{ title }}</n-h1>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { NBreadcrumb, NBreadcrumbItem, NH1 } from 'naive-ui';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

defineProps<{ title: string }>();

const route = useRoute();

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  // Find the deepest matched route that has a breadcrumb meta field
  const currentRoute = [...route.matched].reverse().find(r => r.meta && r.meta.breadcrumb);

  if (currentRoute && currentRoute.meta.breadcrumb) {
    return currentRoute.meta.breadcrumb as BreadcrumbItem[];
  }

  // Fallback for routes without explicit breadcrumb meta
  if (route.meta.title) {
    return [
      { name: 'Dashboard', path: '/dashboard' },
      { name: route.meta.title as string }
    ];
  }

  return [{ name: 'Dashboard', path: '/dashboard' }];
});
</script>

<style scoped>
.page-header-container {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.page-title {
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>
