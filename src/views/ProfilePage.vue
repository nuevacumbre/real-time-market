<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card bg-dark text-white">
          <div class="card-header">
            <h4 class="mb-0"><i class="bi bi-person-gear"></i> Mi Perfil</h4>
          </div>
          <div class="card-body">
            <div class="text-center mb-4">
              <i class="bi bi-person-circle" style="font-size: 5rem"></i>
              <h3 class="mt-3">{{ authStore.userEmail }}</h3>
            </div>

            <div class="alert alert-info">
              <i class="bi bi-info-circle"></i>
              Esta sección está en desarrollo. Pronto podrás editar tu perfil.
            </div>

            <div class="d-grid">
              <button class="btn btn-primary" @click="goBack">
                <i class="bi bi-arrow-left"></i> Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const goBack = () => {
  router.push('/dashboard')
}
</script>
