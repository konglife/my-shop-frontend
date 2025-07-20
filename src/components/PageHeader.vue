<template>
  <div class="page-header-container">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
        <router-link v-if="item.path" :to="item.path">{{ item.label }}</router-link>
        <span v-else>{{ item.label }}</span>
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
  label: string;
  path?: string;
}

defineProps<{ title: string }>();

const route = useRoute();

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [{ label: 'Dashboard', path: '/dashboard' }];

  route.matched.forEach(match => {
    if (match.name && match.name !== 'Dashboard' && match.meta.title) {
      // Check if it's the last item
      const isLast = match.path === route.path;
      items.push({
        label: match.meta.title as string,
        path: isLast ? undefined : match.path,
      });
    }
  });

  return items;
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
