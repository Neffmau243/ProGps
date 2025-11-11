import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('@/views/admin/UsersView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/devices',
      name: 'admin-devices',
      component: () => import('@/views/admin/DevicesView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/history',
      name: 'admin-history',
      component: () => import('@/views/admin/HistoryView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/empleado',
      redirect: '/empleado/dashboard'
    },
    {
      path: '/empleado/dashboard',
      name: 'empleado-dashboard',
      component: () => import('@/views/empleado/DashboardView.vue'),
      meta: { requiresAuth: true, role: 'empleado' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/UnauthorizedView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      next(authStore.isAdmin ? '/admin/dashboard' : '/empleado/dashboard')
    } else {
      next()
    }
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    next('/unauthorized')
    return
  }

  next()
})

export default router
