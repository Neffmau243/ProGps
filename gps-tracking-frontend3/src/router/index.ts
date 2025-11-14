// ============================================
// Router - Application routing configuration
// ============================================

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Import views
const Login = () => import('@/views/auth/LoginView.vue');
const DashboardAdmin = () => import('@/views/admin/DashboardAdmin.vue');
const DashboardEmployee = () => import('@/views/employee/DashboardEmployee.vue');
const UsersManagement = () => import('@/views/admin/UsersManagement.vue');
const DevicesManagement = () => import('@/views/admin/DevicesManagement.vue');
const RealTimeMap = () => import('@/views/admin/RealTimeMap.vue');
const RouteHistory = () => import('@/views/admin/RouteHistory.vue');
const MyDevices = () => import('@/views/employee/MyDevices.vue');
const ProfileView = () => import('@/views/profile/ProfileView.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, isPublic: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardEmployee, // Will be redirected based on role
    meta: { requiresAuth: true },
  },
  // Admin Routes
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: DashboardAdmin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'UsersManagement',
    component: UsersManagement,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/devices',
    name: 'DevicesManagement',
    component: DevicesManagement,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/map',
    name: 'RealTimeMap',
    component: RealTimeMap,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/history',
    name: 'RouteHistory',
    component: RouteHistory,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  // Employee Routes
  {
    path: '/employee/dashboard',
    name: 'EmployeeDashboard',
    component: DashboardEmployee,
    meta: { requiresAuth: true, requiresEmployee: true },
  },
  {
    path: '/employee/my-devices',
    name: 'MyDevices',
    component: MyDevices,
    meta: { requiresAuth: true, requiresEmployee: true },
  },
  // Common Routes
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guards
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // Initialize auth from storage if not done
  if (!authStore.token) {
    authStore.initializeFromStorage();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.isAdmin;
  const isEmployee = authStore.isEmployee;

  // Public routes (Login)
  if (to.meta.isPublic) {
    if (isAuthenticated) {
      // Redirect to dashboard if already logged in
      if (isAdmin) {
        next({ name: 'AdminDashboard' });
      } else {
        next({ name: 'EmployeeDashboard' });
      }
    } else {
      next();
    }
    return;
  }

  // Protected routes
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next({ name: 'Login' });
      return;
    }

    // Admin routes
    if (to.meta.requiresAdmin && !isAdmin) {
      next({ name: 'EmployeeDashboard' });
      return;
    }

    // Employee routes
    if (to.meta.requiresEmployee && !isEmployee) {
      next({ name: 'AdminDashboard' });
      return;
    }

    // Generic dashboard redirect based on role
    if (to.name === 'Dashboard') {
      if (isAdmin) {
        next({ name: 'AdminDashboard' });
      } else {
        next({ name: 'EmployeeDashboard' });
      }
      return;
    }
  }

  next();
});

export default router;
