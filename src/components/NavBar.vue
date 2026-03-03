<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"> 📈 Real-Time Market </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Rutas principales -->
          <li class="nav-item">
            <router-link class="nav-link" to="/" :class="{ active: $route.path === '/' }">
              <i class="bi bi-house-door"></i> Inicio
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/market"
              :class="{ active: $route.path === '/market' }"
            >
              <i class="bi bi-graph-up"></i> Mercado
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/news"
              :class="{ active: $route.path.startsWith('/news') }"
            >
              <i class="bi bi-newspaper"></i> Noticias
            </router-link>
          </li>

          <!-- Menú desplegable de todas las rutas -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-grid"></i> Explorar
            </a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li>
                <router-link class="dropdown-item" to="/crypto">
                  <i class="bi bi-currency-bitcoin"></i> Criptomonedas
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link class="dropdown-item" to="/product/AAPL">
                  <i class="bi bi-phone"></i> Apple (ejemplo)
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/product/TSLA">
                  <i class="bi bi-car-front"></i> Tesla (ejemplo)
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link class="dropdown-item" to="/market?filter=tecnologia">
                  <i class="bi bi-funnel"></i> Filtrar Tecnología
                </router-link>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Menú de usuario -->
        <ul class="navbar-nav">
          <template v-if="authStore.isAuthenticated">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle"></i> {{ userDisplayName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                <li>
                  <router-link class="dropdown-item" to="/dashboard">
                    <i class="bi bi-speedometer2"></i> Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="bi bi-person-gear"></i> Mi Perfil
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/portfolio">
                    <i class="bi bi-briefcase"></i> Mi Portafolio
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="handleLogout">
                    <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">
                <i class="bi bi-person-plus"></i> Registrarse
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const userDisplayName = computed(() => {
  if (!authStore.userEmail) return 'Usuario'
  return authStore.userEmail.split('@')[0] // Muestra solo la parte antes del @
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.dropdown-menu-dark {
  background-color: #343a40;
  border-color: rgba(255, 255, 255, 0.1);
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-item.text-danger:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.dropdown-divider {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.nav-link,
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-link i,
.dropdown-item i {
  font-size: 1.1rem;
}
</style>
