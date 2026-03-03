<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card bg-dark text-white shadow-lg">
          <div class="card-header bg-primary text-white py-3">
            <h4 class="mb-0 text-center">
              <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
            </h4>
          </div>

          <div class="card-body p-4">
            <div v-if="authStore.error" class="alert alert-danger">
              {{ authStore.error }}
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label text-white-50">
                  <i class="bi bi-envelope"></i> Correo Electrónico
                </label>
                <input
                  type="email"
                  class="form-control bg-dark text-white border-secondary"
                  v-model="email"
                  required
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50">
                  <i class="bi bi-lock"></i> Contraseña
                </label>
                <input
                  type="password"
                  class="form-control bg-dark text-white border-secondary"
                  v-model="password"
                  required
                  placeholder="••••••••"
                />
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="authStore.loading">
                  <span
                    v-if="authStore.loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i class="bi bi-box-arrow-in-right"></i>
                  {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
                </button>
              </div>
            </form>

            <hr class="bg-secondary" />

            <div class="text-center">
              <p class="text-white-50 mb-0">
                ¿No tienes cuenta?
                <router-link to="/register" class="text-primary"> Regístrate aquí </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  }
}
</script>
