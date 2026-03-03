<template>
  <div class="card bg-dark text-white mb-4">
    <div class="card-header">
      <h5 class="mb-0">
        <i class="bi bi-clock-history"></i>
        {{ title }}
      </h5>
    </div>
    <div class="card-body">
      <div v-if="!authStore.isAuthenticated" class="text-center text-white-50 py-3">
        <i class="bi bi-person-lock fs-1"></i>
        <p class="mt-2">Inicia sesión para ver tu historial</p>
        <router-link to="/login" class="btn btn-primary btn-sm">
          <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
        </router-link>
      </div>

      <div v-else-if="loading" class="text-center py-3">
        <div class="spinner-border spinner-border-sm text-light"></div>
        <p class="text-white-50 mt-2">Cargando historial...</p>
      </div>

      <div v-else-if="uniqueHistory.length === 0" class="text-center text-white-50 py-3">
        <i class="bi bi-bookmark fs-1"></i>
        <p class="mt-2">No has visto ninguna noticia aún</p>
        <router-link to="/news" class="btn btn-primary btn-sm">
          <i class="bi bi-newspaper"></i> Ver Noticias
        </router-link>
      </div>

      <ul v-else class="list-unstyled">
        <li
          v-for="item in uniqueHistory"
          :key="item.id"
          class="mb-3 pb-2 border-bottom border-secondary"
        >
          <router-link :to="`/news/${item.newsId}`" class="text-decoration-none">
            <small class="text-white-50 d-block mb-1">
              <i class="bi bi-clock"></i> {{ formatDate(item.viewedAt) }}
            </small>
            <span class="text-white">{{ item.newsTitle }}</span>
            <div class="mt-1">
              <span class="badge" :class="getCategoryBadge(item.newsCategory)">
                {{ item.newsCategory }}
              </span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNewsHistoryStore } from '@/stores/newsHistory'

const authStore = useAuthStore()
const newsHistoryStore = useNewsHistoryStore()

defineProps({
  title: {
    type: String,
    default: 'Historial de Noticias',
  },
})

// Eliminar duplicados por newsId en el componente también
const uniqueHistory = computed(() => {
  const items = newsHistoryStore.getRecentNews || []
  const unique = {}
  items.forEach((item) => {
    if (!unique[item.newsId] || new Date(item.viewedAt) > new Date(unique[item.newsId].viewedAt)) {
      unique[item.newsId] = item
    }
  })
  return Object.values(unique).sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
})

const loading = computed(() => newsHistoryStore.loading)

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) {
    return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  } else if (hours < 24) {
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  } else if (days < 7) {
    return `Hace ${days} ${days === 1 ? 'día' : 'días'}`
  } else {
    return d.toLocaleDateString('es-CL')
  }
}

const getCategoryBadge = (category) => {
  const badges = {
    Mercados: 'bg-success',
    Tecnología: 'bg-primary',
    Economía: 'bg-warning text-dark',
    Política: 'bg-danger',
    Empresas: 'bg-info text-dark',
  }
  return badges[category] || 'bg-secondary'
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    newsHistoryStore.loadUserHistory()
  }
})
</script>

<style scoped>
.border-secondary {
  border-color: #404040 !important;
}

.list-unstyled a {
  transition: opacity 0.2s;
}

.list-unstyled a:hover {
  opacity: 0.8;
}
</style>
