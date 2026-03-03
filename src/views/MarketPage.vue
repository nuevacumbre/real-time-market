<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-white"><i class="bi bi-graph-up"></i> Mercado en Tiempo Real</h2>
      <div>
        <span class="badge bg-info me-2"> <i class="bi bi-info-circle"></i> Alpha Vantage </span>
        <button class="btn btn-outline-light" @click="refreshData" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i class="bi bi-arrow-repeat" :class="{ spin: loading }"></i>
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="row mb-3">
      <div class="col-md-4">
        <select class="form-select bg-dark text-white border-secondary" v-model="selectedSector">
          <option value="">Todos los sectores</option>
          <option v-for="sector in sectors" :key="sector" :value="sector">{{ sector }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <input
          type="text"
          class="form-control bg-dark text-white border-secondary"
          placeholder="Buscar por nombre o símbolo..."
          v-model="searchQuery"
        />
      </div>
    </div>

    <div v-if="loading && !filteredProducts.length" class="text-center py-5">
      <div class="spinner-border text-light" style="width: 3rem; height: 3rem"></div>
      <p class="text-white-50 mt-3">Cargando datos del mercado desde Alpha Vantage...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="alert alert-info">
      No se encontraron activos con los filtros seleccionados.
    </div>

    <div v-else class="row">
      <div
        class="col-md-6 col-lg-4 mb-4"
        v-for="product in filteredProducts"
        :key="product.simbolo"
      >
        <ProductCard :product="product" />
      </div>
    </div>

    <div class="alert alert-info mt-3" v-if="apiStatus === 'rate-limit'">
      <i class="bi bi-exclamation-triangle"></i>
      Límite de tasa de Alpha Vantage alcanzado. Mostrando datos simulados. Espera 1 minuto para más
      requests.
    </div>

    <small class="text-white-50 d-block text-center mt-3">
      Última actualización: {{ lastUpdate }} | Fuente: Alpha Vantage
    </small>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { fetchMarketData } from '@/services/alphaVantageApi'
import { APP_CONFIG } from '@/config/constants'

const products = ref([])
const loading = ref(true)
const lastUpdate = ref('')
const selectedSector = ref('')
const searchQuery = ref('')
const apiStatus = ref('ok')
let refreshInterval = null

// Obtener sectores únicos
const sectors = computed(() => {
  return [...new Set(products.value.map((p) => p.sector))].sort()
})

// Filtrar productos
const filteredProducts = computed(() => {
  let filtered = products.value

  if (selectedSector.value) {
    filtered = filtered.filter((p) => p.sector === selectedSector.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (p) => p.nombre.toLowerCase().includes(query) || p.simbolo.toLowerCase().includes(query),
    )
  }

  return filtered
})

const loadData = async () => {
  try {
    const data = await fetchMarketData()

    // Verificar si son datos simulados o reales
    const isRealData = data.some((item) => item.volumen && item.volumen > 1000000)
    apiStatus.value = isRealData ? 'ok' : 'rate-limit'

    products.value = data
    lastUpdate.value = new Date().toLocaleTimeString('es-CL')
  } catch (error) {
    console.error('Error loading market data:', error)
    apiStatus.value = 'error'
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  loading.value = true
  await loadData()
}

onMounted(() => {
  loadData()
  refreshInterval = setInterval(loadData, APP_CONFIG.refreshInterval)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.form-select,
.form-control {
  background-color: #2d2d2d;
  border-color: #404040;
  color: white;
}

.form-select option {
  background-color: #2d2d2d;
}
</style>
