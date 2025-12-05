import { createRouter, createWebHistory } from 'vue-router'

import EmployeeLayout from '@/layouts/EmployeeLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

import LoginPage from '@/pages/login/LoginPage.vue'

import JobsPage from '@/pages/employee/JobsPage.vue'
import JobDetailPage from '@/pages/employee/JobDetailPage.vue'
import HistoryPage from '@/pages/employee/HistoryPage.vue'

import AdminDashboardPage from '@/pages/admin/AdminDashboardPage.vue'
import AdminEmployeesPage from '@/pages/admin/employees/AdminEmployeesPage.vue'
import AdminJobsPage from '@/pages/admin/jobs/AdminJobsPage.vue'
import AdminEntriesPage from '@/pages/admin/AdminEntriesPage.vue'
import AdminCreateJobPage from '@/pages/admin/jobs/AdminCreateJobPage.vue'
import AdminEditJobPage from '@/pages/admin/jobs/AdminEditJobPage.vue'
import AdminCreateEmployeePage from '@/pages/admin/employees/AdminCreateEmployeePage.vue'
import AdminEditEmployeePage from '@/pages/admin/employees/AdminEditEmployeePage.vue'

import AdminCustomersPage from '@/pages/admin/customers/AdminCustomersPage.vue'
import AdminCreateCustomerPage from '@/pages/admin/customers/AdminCreateCustomerPage.vue'
import AdminEditCustomerPage from '@/pages/admin/customers/AdminEditCustomerPage.vue'

import AdminLocationsPage from '@/pages/admin/locations/AdminLocationsPage.vue'
import AdminCreateLocationPage from '@/pages/admin/locations/AdminCreateLocationPage.vue'
import AdminEditLocationPage from '@/pages/admin/locations/AdminEditLocationPage.vue'

import AdminAuditLogPage from '@/pages/admin/audit/AdminAuditLogPage.vue'

import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { public: true },
    },
    {
      path: '/',
      component: EmployeeLayout,
      meta: { requiresAuth: true, role: ['EMPLOYEE', 'ADMIN'] },
      children: [
        {
          path: '',
          redirect: '/jobs',
        },
        {
          path: 'jobs',
          name: 'jobs',
          component: JobsPage,
          meta: { requiresAuth: true, role: ['EMPLOYEE'] },
        },
        {
          path: 'job/:id',
          name: 'job-detail',
          component: JobDetailPage,
          meta: { requiresAuth: true, role: ['EMPLOYEE'] },
        },
        {
          path: 'history',
          name: 'history',
          component: HistoryPage,
          meta: { requiresAuth: true, role: ['EMPLOYEE', 'ADMIN'] },
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: ['ADMIN'] },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: AdminDashboardPage,
        },
        {
          path: 'employees',
          name: 'admin-employees',
          component: AdminEmployeesPage,
        },
        {
          path: 'customers',
          component: AdminCustomersPage,
        },
        {
          path: 'customers/create',
          component: AdminCreateCustomerPage,
        },
        {
          path: 'customers/:id',
          component: AdminEditCustomerPage,
        },
        {
          path: 'customers/:customerId/locations',
          component: AdminLocationsPage,
        },
        {
          path: 'customers/:customerId/locations/create',
          component: AdminCreateLocationPage,
        },
        {
          path: 'locations/:id',
          component: AdminEditLocationPage,
        },
        {
          path: 'jobs',
          name: 'admin-jobs',
          component: AdminJobsPage,
        },
        {
          path: 'entries',
          name: 'admin-entries',
          component: AdminEntriesPage,
        },
        {
          path: 'jobs/create',
          name: 'admin-create-job',
          component: AdminCreateJobPage,
          meta: { requiresAuth: true, role: ['ADMIN'] },
        },
        {
          path: 'jobs/:id/edit',
          name: 'admin-edit-job',
          component: AdminEditJobPage,
          meta: { requiresAuth: true, role: ['ADMIN'] },
        },
        {
          path: 'employees/create',
          name: 'admin-create-employee',
          component: AdminCreateEmployeePage,
          meta: { requiresAuth: true, role: ['ADMIN'] },
        },
        {
          path: 'employees/:id/edit',
          name: 'admin-edit-employee',
          component: AdminEditEmployeePage,
          meta: { requiresAuth: true, role: ['ADMIN'] },
        },
        {
          path: 'audit-log',
          name: 'admin-audit-log',
          component: AdminAuditLogPage,
          meta: { requiresAuth: true, role: ['ADMIN'] },
        },
      ],
    },

    // Default redirect
    { path: '/', redirect: '/login' },

    // Catch-all redirect to login
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

export default router

router.beforeEach((to) => {
  const auth = useAuthStore()

  const isPublic = to.meta.public === true
  const requiresAuth = to.meta.requiresAuth === true

  // 1. If route is PUBLIC, let user access it
  if (isPublic) {
    // But redirect logged-in users away from login screen
    if (to.path === '/login' && auth.token) {
      if (auth.user?.role === 'ADMIN') {
        return '/admin'
      }
      return '/history'
    }
    return true
  }

  // 2. Route requires authentication
  if (requiresAuth && !auth.token) {
    return '/login'
  }

  // 3. Check role requirements (admin-only, employee-only, etc.)
  if (requiresAuth && to.meta.role) {
    const allowed = to.meta.role as string[]
    const userRole = auth.user?.role

    if (!allowed.includes(userRole!)) {
      // redirect them based on their role
      if (userRole === 'ADMIN') return '/admin'
      if (userRole === 'EMPLOYEE') return '/history'
      return '/login'
    }
  }

  return true
})
