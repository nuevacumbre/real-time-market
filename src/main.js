import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import DOMPurify from 'dompurify'
import './services/firebase'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth listener
const authStore = useAuthStore(pinia)
authStore.initAuthListener()

// Global sanitize directive
app.directive('sanitize', {
  mounted(el, binding) {
    if (binding.value) {
      el.innerHTML = DOMPurify.sanitize(binding.value)
    }
  },
  updated(el, binding) {
    if (binding.value) {
      el.innerHTML = DOMPurify.sanitize(binding.value)
    }
  },
})

// Global sanitize method
app.config.globalProperties.$sanitize = (text) => {
  return DOMPurify.sanitize(text)
}

app.mount('#app')
