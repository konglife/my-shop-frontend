<template>
  <n-layout style="height: 100vh">
    <n-layout-header class="modern-header" bordered>
      <div class="header-content">
        <!-- Menu Toggle Button -->
        <n-button
          text
          @click="handleMenuButtonClick"
          class="menu-button"
          :class="{ 'menu-button--mobile': isMobile }"
        >
          <n-icon size="24">
            <menu-icon />
          </n-icon>
        </n-button>

        <!-- Brand Section -->
        <div class="brand-section">
          <n-icon size="32" class="brand-icon">
            <build-outline />
          </n-icon>
          <div class="brand-text">
            <h2 class="brand-title">RepairShop Pro</h2>
            <span class="brand-subtitle">Management System</span>
          </div>
        </div>

        <!-- Quick Actions & User Section -->
        <div class="header-actions">
          <!-- Quick Actions -->
          <n-space align="center" :size="12">
            <n-tooltip trigger="hover" placement="bottom">
              <template #trigger>
                <n-button 
                  type="primary" 
                  ghost 
                  size="medium"
                  class="quick-action-btn"
                  @click="() => $router.push('/sales/new')"
                >
                  <template #icon>
                    <n-icon><cart-outline /></n-icon>
                  </template>
                  Quick Sale
                </n-button>
              </template>
              Create new sale quickly
            </n-tooltip>

            <n-tooltip trigger="hover" placement="bottom">
              <template #trigger>
                <n-button 
                  type="warning" 
                  ghost 
                  size="medium"
                  class="quick-action-btn"
                  @click="() => $router.push('/repairs/new')"
                >
                  <template #icon>
                    <n-icon><build-outline /></n-icon>
                  </template>
                  New Repair
                </n-button>
              </template>
              Start new repair job
            </n-tooltip>

            <!-- Notifications -->
            <n-tooltip trigger="hover" placement="bottom">
              <template #trigger>
                <n-badge :value="notificationCount" :max="9" show-zero>
                  <n-button text class="notification-btn">
                    <n-icon size="20"><notifications-outline /></n-icon>
                  </n-button>
                </n-badge>
              </template>
              Notifications & Alerts
            </n-tooltip>
          </n-space>

          <!-- User Dropdown -->
          <n-dropdown trigger="hover" :options="userOptions" @select="handleUserSelect">
            <div class="user-section">
              <n-avatar 
                round 
                size="medium" 
                :style="{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }"
              >
                {{ getUserInitials() }}
              </n-avatar>
              <div class="user-info">
                <span class="user-name">{{ authStore.user?.username || 'User' }}</span>
                <span class="user-role">Shop Owner</span>
              </div>
              <n-icon size="16" class="dropdown-arrow">
                <chevron-down-outline />
              </n-icon>
            </div>
          </n-dropdown>
        </div>
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

      <n-layout-content style="padding: 24px; background-color: #f0f2f5; min-height: calc(100vh - 64px);" :native-scrollbar="false">
        <div style="max-width: 1280px; margin: 0 auto;">
          <router-view />
        </div>
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
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useStorage, useBreakpoints } from '@vueuse/core';
import type { MenuOption, DropdownOption } from 'naive-ui';
import {
  NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NMenu, NIcon, 
  NButton, NSpace, NAvatar, NDropdown, NDrawer, NDrawerContent, NBadge, NTooltip
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
  LogOutOutline as LogoutIcon,
  BuildOutline,
  CartOutline,
  NotificationsOutline,
  ChevronDownOutline,
  SettingsOutline,
  PersonOutline
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
const router = useRouter();

// Notification count (mock data - จะเชื่อมต่อกับ API ในอนาคต)
const notificationCount = ref(3);

const getUserInitials = () => {
  const username = authStore.user?.username || 'U';
  return username.slice(0, 2).toUpperCase();
};

const userOptions: DropdownOption[] = [
  {
    label: 'Profile',
    key: 'profile',
    icon: () => h(NIcon, null, { default: () => h(PersonOutline) })
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: () => h(NIcon, null, { default: () => h(SettingsOutline) })
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: 'Logout',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogoutIcon) })
  }
];

const handleUserSelect = (key: string | number) => {
  switch (key) {
    case 'profile':
      router.push('/profile');
      break;
    case 'settings':
      router.push('/settings');
      break;
    case 'logout':
      authStore.logout();
      break;
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

<style scoped>
/* Modern Header Styles */
.modern-header {
  height: 70px;
  padding: 0 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* Menu Button */
.menu-button {
  color: white !important;
  margin-right: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.05);
}

.menu-button--mobile {
  margin-right: 12px;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 8px;
}

.brand-icon {
  color: #ffd93d;
  margin-right: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Quick Action Buttons */
.quick-action-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.quick-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Notification Button */
.notification-btn {
  color: white !important;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.notification-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.1);
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-section:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  flex-direction: column;
  margin: 0 12px;
  text-align: left;
}

.user-name {
  color: white;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.user-role {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease;
}

.user-section:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .brand-title {
    font-size: 16px;
  }
  
  .brand-subtitle {
    font-size: 10px;
  }
  
  .quick-action-btn span {
    display: none;
  }
  
  .user-info {
    display: none;
  }
  
  .header-actions {
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .brand-text {
    display: none;
  }
  
  .quick-action-btn {
    padding: 8px !important;
  }
}

/* Animation Classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
