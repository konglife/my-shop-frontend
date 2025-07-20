<template>
  <n-layout style="height: 100vh">
    <n-layout-header style="height: 64px; padding: 0 24px;" bordered>
      <div style="display: flex; align-items: center; height: 100%;">
        <n-button text @click="handleMenuButtonClick" style="margin-right: 16px;">
          <n-icon size="28">
            <menu-icon />
          </n-icon>
        </n-button>
        <h3 style="margin: 0; flex-grow: 1;">My Shop Management</h3>
        <n-space align="center">
          <n-dropdown trigger="hover" :options="userOptions" @select="handleUserSelect">
            <n-space align="center" style="cursor: pointer;">
              <n-avatar round size="small" />
              <span>{{ authStore.user?.username }}</span>
            </n-space>
          </n-dropdown>
        </n-space>
      </div>
    </n-layout-header>

    <n-layout has-sider>
      <n-layout-sider
        v-if="showSider"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        :native-scrollbar="false"
        
      >
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>

      <n-layout-content style="padding: 24px;" :native-scrollbar="false">
        <router-view />
      </n-layout-content>
    </n-layout>

    <n-drawer v-model:show="showDrawer" :width="240" placement="left">
      <n-drawer-content title="My Shop Management" :native-scrollbar="false" body-content-style="padding: 0;">
      <n-layout-sider
        style="height: 100%"
        :native-scrollbar="false"
        :collapsed="false"
        :width="240"
      >
        <n-menu :options="menuOptions" />
      </n-layout-sider>
      </n-drawer-content>
    </n-drawer>
  </n-layout>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useStorage, useBreakpoints } from '@vueuse/core';
import type { MenuOption, DropdownOption } from 'naive-ui';
import {
  NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NMenu, NIcon, 
  NButton, NSpace, NAvatar, NDropdown, NDrawer, NDrawerContent
} from 'naive-ui';
import {
  HomeOutline as IconHome,
  CubeOutline as IconProduct,
  AppsOutline as IconCategory,
  ScaleOutline as IconUnit,
  PeopleOutline as IconCustomer,
  BusinessOutline as IconSupplier,
  ReceiptOutline as IconPurchase,
  CartOutline as IconSale,
  BuildOutline as IconRepair,
  Menu as MenuIcon,
  LogOutOutline as LogoutIcon
} from '@vicons/ionicons5';

// --- Responsive & Sidebar State ---
const breakpoints = useBreakpoints({ mobile: 768 });
const isMobile = breakpoints.smaller('mobile');
const collapsed = useStorage('sidebarCollapsed', isMobile.value);

const showDrawer = ref(false);
const showSider = computed(() => !isMobile.value);

const handleMenuButtonClick = () => {
  if (isMobile.value) {
    showDrawer.value = !showDrawer.value;
  } else {
    collapsed.value = !collapsed.value;
  }
};

// --- Auth & User Menu ---
const authStore = useAuthStore();

const userOptions: DropdownOption[] = [
  {
    label: 'Logout',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogoutIcon) })
  }
];

const handleUserSelect = (key: string | number) => {
  if (key === 'logout') {
    authStore.logout();
  }
};

// --- Sider Menu ---
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: () => h(RouterLink, { to: { name: 'Dashboard' } }, { default: () => 'Dashboard' }),
    key: 'dashboard',
    icon: renderIcon(IconHome),
  },
  {
    label: () => h(RouterLink, { to: { name: 'Products' } }, { default: () => 'Products' }),
    key: 'Products',
    icon: renderIcon(IconProduct),
  },
  {
    label: () => h(RouterLink, { to: { name: 'Categories' } }, { default: () => 'Categories' }),
    key: 'Categories',
    icon: renderIcon(IconCategory)
  },
  {
    label: () => h(RouterLink, { to: '/units' }, { default: () => 'Units' }),
    key: 'units',
    icon: renderIcon(IconUnit)
  },
  {
    label: () => h(RouterLink, { to: '/customers' }, { default: () => 'Customers' }),
    key: 'customers',
    icon: renderIcon(IconCustomer)
  },
  {
    label: () => h(RouterLink, { to: '/suppliers' }, { default: () => 'Suppliers' }),
    key: 'suppliers',
    icon: renderIcon(IconSupplier)
  },
  {
    label: () => h(RouterLink, { to: { name: 'Purchases' } }, { default: () => 'Purchases' }),
    key: 'purchases',
    icon: renderIcon(IconPurchase)
  },
  {
    label: () => h(RouterLink, { to: { name: 'Sales' } }, { default: () => 'Sales' }),
    key: 'sales',
    icon: renderIcon(IconSale),
  },
  {
    label: () => h(RouterLink, { to: { name: 'Repairs' } }, { default: () => 'Repairs' }),
    key: 'repairs',
    icon: renderIcon(IconRepair),
  },
];
</script>
