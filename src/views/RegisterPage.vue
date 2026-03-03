<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card bg-dark text-white shadow-lg">
          <div class="card-header bg-success text-white py-3">
            <h4 class="mb-0 text-center"><i class="bi bi-person-plus"></i> Crear Cuenta</h4>
          </div>

          <div class="card-body p-4">
            <div v-if="authStore.error" class="alert alert-danger">
              {{ authStore.error }}
            </div>

            <form @submit.prevent="handleRegister">
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
                  minlength="6"
                  placeholder="Mínimo 6 caracteres"
                />
                <small class="text-white-50">Mínimo 6 caracteres</small>
              </div>

              <div class="mb-3">
                <label class="form-label text-white-50">
                  <i class="bi bi-lock-fill"></i> Confirmar Contraseña
                </label>
                <input
                  type="password"
                  class="form-control bg-dark text-white border-secondary"
                  v-model="confirmPassword"
                  required
                  placeholder="Repite tu contraseña"
                />
                <small v-if="password !== confirmPassword && confirmPassword" class="text-danger">
                  Las contraseñas no coinciden
                </small>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" v-model="acceptTerms" required />
                <label class="form-check-label text-white-50">
                  Acepto los <a href="#" class="text-primary">términos y condiciones</a>
                </label>
              </div>

              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn btn-success btn-lg"
                  :disabled="authStore.loading || password !== confirmPassword || !acceptTerms"
                >
                  <span
                    v-if="authStore.loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i class="bi bi-person-check"></i>
                  {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
                </button>
              </div>
            </form>

            <hr class="bg-secondary" />

            <div class="text-center">
              <p class="text-white-50 mb-0">
                ¿Ya tienes cuenta?
                <router-link to="/login" class="text-primary"> Inicia sesión </router-link>
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
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) return

  const result = await authStore.register(email.value, password.value)

  if (result.success) {
    router.push('/dashboard')
  }
}
</script>
