import { createRouter, createWebHistory } from 'vue-router'

import EmployeeLayout from '@/layouts/EmployeeLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/LoginPage.vue'),
    },
    {
      path: '/',
      component: EmployeeLayout,
      children: [
        {
          path: '',
          component: () => import('@/pages/employee/JobsPage.vue'),
        },
        {
          path: 'job/:id',
          component: () => import('@/pages/employee/JobDetailPage.vue'),
        },
        {
          path: 'history',
          component: () => import('@/pages/employee/HistoryPage.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          component: () => import('@/pages/admin/AdminDashboardPage.vue'),
        },
        {
          path: 'jobs',
          component: () => import('@/pages/admin/AdminJobsPage.vue'),
        },
        {
          path: 'entries',
          component: () => import('@/pages/admin/AdminEntriesPage.vue'),
        },
      ],
    },
  ],
})

export default router
