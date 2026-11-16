import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './styles/main.css'
import { useAuthStore } from './stores/authStore.js'
import { setSessionExpiredHandler } from './services/apiClient.js'

const app = createApp(App)

app.use(createPinia())
const auth = useAuthStore()
setSessionExpiredHandler(() => {
  auth.invalidateSession()
  const current = router.currentRoute.value
  if (current.meta.requiresAuth) {
    void router.replace({ name: 'login', query: { redirect: current.fullPath } })
  }
})
app.use(vuetify)
app.use(router)

app.mount('#app')
