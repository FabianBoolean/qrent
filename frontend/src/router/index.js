import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import { createAuthGuard } from './guards.js'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const placeholder = () => import('@/views/PlaceholderView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login', component: AuthLayout,
      children: [{ path: '', name: 'login', component: () => import('@/views/LoginView.vue') }],
    },
    {
      path: '/', component: MainLayout, meta: { requiresAuth: true },
      children: [
        { path: '', name: 'home', redirect: '/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: 'Dashboard' } },
        { path: 'equipment', name: 'inventory', component: () => import('@/views/EquipmentListView.vue') },
        { path: 'equipment/:id', name: 'equipment-detail', component: () => import('@/views/EquipmentDetailView.vue'), meta: { title: 'Equipment-Details' } },
        { path: 'checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
        { path: 'return', name: 'return', component: () => import('@/views/ReturnView.vue') },
        { path: 'my-transactions', name: 'my-transactions', component: placeholder, meta: { title: 'Meine Vorgänge' } },
        { path: 'management/equipment', name: 'equipment-management', component: placeholder, meta: { title: 'Equipment verwalten', requiredRole: 'TEACHER' } },
        { path: 'management/templates', name: 'template-management', component: placeholder, meta: { title: 'Vorlagen verwalten', requiredRole: 'TEACHER' } },
        { path: 'management/roles', name: 'role-management', component: placeholder, meta: { title: 'Rollen verwalten', requiredRole: 'ADMIN' } },
        { path: 'tutorials', name: 'tutorials', component: () => import('@/views/TutorialsView.vue') },
        { path: 'verleihungen', name: 'active-rentals', component: () => import('@/views/ActiveRentalsView.vue'), meta: { requiredRole: 'TEACHER' } },
        { path: 'logs', name: 'logs', component: () => import('@/views/LogsView.vue') },
        { path: 'forbidden', name: 'forbidden', component: () => import('@/views/ForbiddenView.vue') },
        ...(import.meta.env.DEV
          ? [{ path: 'dev', name: 'development', component: () => import('@/views/DevelopmentView.vue'), meta: { title: 'Entwicklung' } }]
          : []),
      ],
    },
    { path: '/ausleihen', redirect: (to) => ({ path: '/checkout', query: to.query, hash: to.hash }) },
    { path: '/rueckgabe', redirect: (to) => ({ path: '/return', query: to.query, hash: to.hash }) },
    { path: '/inventar', redirect: (to) => ({ path: '/equipment', query: to.query, hash: to.hash }) },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

// Store erst beim Navigieren abrufen, nachdem Pinia registriert wurde.
router.beforeEach((to) => createAuthGuard(useAuthStore(), router)(to))

export default router
