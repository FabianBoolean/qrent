import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import ReturnView from '@/views/ReturnView.vue'
import InventoryView from '@/views/InventoryView.vue'
import TutorialsView from '@/views/TutorialsView.vue'
import ActiveRentalsView from '@/views/ActiveRentalsView.vue'
import LogsView from '@/views/LogsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/ausleihen', name: 'checkout', component: CheckoutView },
    { path: '/rueckgabe', name: 'return', component: ReturnView },
    { path: '/inventar', name: 'inventory', component: InventoryView },
    { path: '/tutorials', name: 'tutorials', component: TutorialsView },
    { path: '/verleihungen', name: 'active-rentals', component: ActiveRentalsView },
    { path: '/logs', name: 'logs', component: LogsView },
  ],
})

export default router
