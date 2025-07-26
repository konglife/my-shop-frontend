import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Import layouts and views
import MainLayout from '@/layouts/MainLayout.vue';
import RouterPassThrough from '@/layouts/RouterPassThrough.vue';
import LoginView from '@/views/auth/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';

import SalesView from '@/views/sales/SalesView.vue';
import RepairsView from '@/views/repairs/RepairsView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard' },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/products/ProductsView.vue'),
        meta: { title: 'Products' },
      },
      {
        path: 'categories',
        component: RouterPassThrough,
        children: [
          {
            path: '',
            name: 'Categories',
            component: () => import('@/views/categories/CategoriesView.vue'),
            meta: {
              title: 'Categories',
              breadcrumb: [
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Categories' }
              ]
            },
          },
          {
            path: ':id',
            name: 'CategoryDetail',
            component: () => import('@/views/categories/CategoryDetailView.vue'),
            props: true,
            meta: {
              title: 'Category Details',
              breadcrumb: [
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Categories', path: '/categories' },
                { name: 'Details' }
              ]
            },
          },
        ],
      },
      {
        path: 'units',
        component: RouterPassThrough,
        children: [
          {
            path: '',
            name: 'Units',
            component: () => import('@/views/units/UnitsView.vue'),
            meta: {
              title: 'Units',
              breadcrumb: [
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Units' }
              ]
            },
          },
          {
            path: ':id',
            name: 'UnitDetails',
            component: () => import('@/views/units/UnitDetailView.vue'),
            props: true,
            meta: {
              title: 'Unit Details',
              breadcrumb: [
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Units', path: '/units' },
                { name: 'Details' }
              ]
            },
          },
        ],
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/customers/CustomersView.vue'),
        meta: { title: 'Customers' },
      },
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('@/views/suppliers/SuppliersView.vue'),
        meta: { title: 'Suppliers' },
      },
      {
        path: 'purchases',
        component: RouterPassThrough,
        meta: { title: 'Purchases' },
        children: [
          {
            path: '',
            name: 'Purchases',
            component: () => import('@/views/purchases/PurchasesView.vue'),
            meta: { title: 'Purchases' },
          },
          {
            path: 'new',
            name: 'PurchaseNew',
            component: () => import('@/views/purchases/PurchaseDetailView.vue'),
            meta: { title: 'New Purchase' },
          },
          {
            path: ':documentId',
            name: 'PurchaseDetail',
            component: () => import('@/views/purchases/PurchaseDetailView.vue'),
            props: true,
            meta: { requiresAuth: true }
          },
        ]
      },
      {
        path: 'sales',
        component: RouterPassThrough,
        meta: { title: 'Sales' },
        children: [
          {
            path: '',
            name: 'Sales',
            component: () => import('@/views/sales/SalesView.vue'),
            meta: { requiresAuth: true }
          },
          {
            path: 'new',
            name: 'NewSale',
            component: () => import('@/views/sales/SaleDetailView.vue'),
            meta: { requiresAuth: true }
          },
          {
            path: ':documentId',
            name: 'SaleDetail',
            component: () => import('@/views/sales/SaleDetailView.vue'),
            props: true,
            meta: { requiresAuth: true }
          },
        ]
      },
      {
        path: 'repairs',
        name: 'Repairs',
        component: RepairsView,
        meta: { title: 'Repairs' },
      },
      // Add other routes for customers, purchases etc. here
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Store the url the user is trying to access so we can redirect back
    authStore.returnUrl = to.fullPath;
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // If logged in user tries to access login page, redirect to dashboard
    next('/');
  } else {
    next();
  }
});

export default router;
