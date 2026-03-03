<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-8">
        <h2 class="text-white mb-4"><i class="bi bi-newspaper"></i> Noticias del Mercado</h2>

        <!-- Category Filter -->
        <div class="btn-group mb-4" role="group">
          <button
            class="btn btn-outline-light"
            :class="{ active: selectedCategory === null }"
            @click="selectedCategory = null"
          >
            Todas
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="btn btn-outline-light"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- News List -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-light" style="width: 3rem; height: 3rem"></div>
          <p class="text-white-50 mt-3">Cargando noticias desde Firebase...</p>
        </div>

        <div v-else-if="filteredNews.length === 0" class="alert alert-info">
          No hay noticias disponibles en esta categoría.
        </div>

        <div v-else>
          <NewsCard v-for="item in filteredNews" :key="item.id" :news="item" />
        </div>
      </div>

      <div class="col-lg-4">
        <!-- Reemplazar la sección de Recently Viewed con el nuevo componente TODO: BORRAR RECENTLY VIEW -->
        <NewsHistory title="Mi Historial de Lectura" />

        <!-- Recently Viewed -->
        <div class="card bg-dark text-white mb-4">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-clock-history"></i> Vistos Recientemente</h5>
          </div>
          <div class="card-body">
            <div v-if="recentlyViewed.length === 0" class="text-white-50">
              No has visto noticias recientemente.
            </div>
            <ul v-else class="list-unstyled">
              <li v-for="item in recentlyViewed" :key="item.id" class="mb-2">
                <router-link :to="`/news/${item.id}`" class="text-white-50 text-decoration-none">
                  📰 {{ item.title.substring(0, 40) }}...
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- Market Summary - AHORA USA ALPHA VANTAGE -->
        <div class="card bg-dark text-white">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-graph-up"></i> Resumen de Mercado</h5>
          </div>
          <div class="card-body">
            <div v-if="marketData.length === 0" class="text-white-50">
              Cargando datos desde Alpha Vantage...
            </div>
            <ul v-else class="list-group list-group-flush bg-transparent">
              <li
                v-for="item in marketData.slice(0, 5)"
                :key="item.simbolo"
                class="list-group-item bg-transparent text-white d-flex justify-content-between"
              >
                <span>{{ item.simbolo }}</span>
                <span :class="item.variacion >= 0 ? 'text-success' : 'text-danger'">
                  {{ item.variacion >= 0 ? '+' : '' }}{{ item.variacion }}%
                </span>
              </li>
            </ul>
            <small class="text-white-50 d-block text-center mt-2"> Fuente: Alpha Vantage </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import NewsHistory from '@/components/NewsHistory.vue'
import { fetchNews } from '@/services/newsApi'
// 🔴 IMPORTANTE: Cambiamos de stockApi a alphaVantageApi
import { fetchMarketData } from '@/services/alphaVantageApi'
import { NEWS_CATEGORIES, STORAGE_KEYS } from '@/config/constants'

const loading = ref(true)
const allNews = ref([])
const marketData = ref([])
const selectedCategory = ref(null)

const categories = NEWS_CATEGORIES

const filteredNews = computed(() => {
  if (!selectedCategory.value) return allNews.value
  return allNews.value.filter((item) => item.category === selectedCategory.value)
})

const recentlyViewed = computed(() => {
  const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED)
  if (saved) {
    try {
      return JSON.parse(saved)
        .slice(0, 5)
        .map((item) => item.product)
    } catch (e) {
      console.error('Error parsing recently viewed from localStorage FROM NewsPage.vue:', e)
      return []
    }
  }
  return []
})

const loadData = async () => {
  try {
    // Cargar noticias desde Firebase
    const newsData = await fetchNews()
    allNews.value = newsData
    console.log('✅ Noticias cargadas:', newsData.length)

    // Cargar datos de mercado desde Alpha Vantage (SIN CORS)
    const market = await fetchMarketData()
    marketData.value = market
    console.log('✅ Datos de mercado cargados:', market.length)
  } catch (error) {
    console.error('❌ Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.btn-group .btn.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.btn-outline-light {
  border-color: #404040;
  color: #fff;
}

.btn-outline-light:hover {
  background-color: #404040;
  border-color: #404040;
}

.btn-outline-light.active {
  background-color: var(--bs-primary) !important;
  border-color: var(--bs-primary) !important;
}
</style>
