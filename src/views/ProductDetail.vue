<template>
  <div class="container" v-if="product">
    <div class="row">
      <div class="col-lg-8">
        <div class="card bg-dark text-white mb-4">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="mb-0">{{ product.nombre }}</h3>
              <span class="badge" :class="getSectorBadge(product.sector)">{{
                product.sector
              }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="row text-center mb-4">
              <div class="col-6">
                <h5 class="text-white-50">Símbolo</h5>
                <h2 class="text-primary">{{ product.simbolo }}</h2>
              </div>
              <div class="col-6">
                <h5 class="text-white-50">Precio Actual</h5>
                <h2 class="text-white">${{ formatPrice(product.precio) }}</h2>
              </div>
            </div>

            <div class="alert" :class="product.variacion >= 0 ? 'alert-success' : 'alert-danger'">
              <strong>Variación:</strong> {{ product.variacion >= 0 ? '+' : ''
              }}{{ product.variacion }}%
              <span class="ms-3" v-if="product.volumen">
                <i class="bi bi-bar-chart"></i> Volumen: {{ formatVolume(product.volumen) }}
              </span>
            </div>

            <!-- Chart -->
            <div class="bg-dark p-3 rounded mb-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Gráfico de Precios</h5>
                <div>
                  <button
                    v-for="period in periods"
                    :key="period.value"
                    class="btn btn-sm me-1"
                    :class="
                      selectedPeriod === period.value ? 'btn-primary' : 'btn-outline-secondary'
                    "
                    @click="changePeriod(period.value)"
                  >
                    {{ period.label }}
                  </button>
                </div>
              </div>
              <canvas ref="chartCanvas"></canvas>
            </div>

            <!-- Technical Indicators -->
            <div class="row mb-3" v-if="technicalIndicators.length">
              <div class="col-12">
                <h5>Indicadores Técnicos</h5>
              </div>
              <div
                class="col-md-3 col-6 mb-2"
                v-for="indicator in technicalIndicators"
                :key="indicator.name"
              >
                <div class="bg-dark p-2 rounded text-center">
                  <small class="text-white-50">{{ indicator.name }}</small>
                  <h6
                    :class="
                      indicator.trend === 'up'
                        ? 'text-success'
                        : indicator.trend === 'down'
                          ? 'text-danger'
                          : ''
                    "
                  >
                    {{ indicator.value }}
                  </h6>
                </div>
              </div>
            </div>

            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
              <button class="btn btn-success btn-lg px-5" @click="handleBuy">
                <i class="bi bi-cart-plus"></i> Comprar
              </button>
              <button class="btn btn-warning btn-lg px-5" @click="handleSell">
                <i class="bi bi-cart-dash"></i> Vender
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card bg-dark text-white mb-4">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-info-circle"></i> Información</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush bg-transparent">
              <li class="list-group-item bg-transparent text-white d-flex justify-content-between">
                <span>Sector</span>
                <span class="badge" :class="getSectorBadge(product.sector)">{{
                  product.sector
                }}</span>
              </li>
              <li
                class="list-group-item bg-transparent text-white d-flex justify-content-between"
                v-if="product.volumen"
              >
                <span>Volumen</span>
                <span>{{ formatVolume(product.volumen) }}</span>
              </li>
              <li class="list-group-item bg-transparent text-white d-flex justify-content-between">
                <span>Última actualización</span>
                <span>{{ formatTime(product.timestamp) }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="card bg-dark text-white">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-arrow-repeat"></i> Acciones Rápidas</h5>
          </div>
          <div class="card-body">
            <button class="btn btn-outline-primary w-100 mb-2" @click="addToWatchlist">
              <i class="bi bi-star"></i> Agregar a Watchlist
            </button>
            <button class="btn btn-outline-info w-100" @click="goToNews">
              <i class="bi bi-newspaper"></i> Ver Noticias Relacionadas
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-5">
    <div class="spinner-border text-light"></div>
    <p class="text-white-50 mt-3">Cargando detalles...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioStore } from '@/stores/portfolio'
import { useHistoryStore } from '@/stores/history'
import { getDailyTimeSeries, getSMA } from '@/services/alphaVantageApi'
import { MARKET_SYMBOLS } from '@/config/constants'
import Chart from 'chart.js/auto'

const route = useRoute()
const router = useRouter()
const portfolioStore = usePortfolioStore()
const historyStore = useHistoryStore()

const product = ref(null)
const chartCanvas = ref(null)
const selectedPeriod = ref('1m')
const technicalIndicators = ref([])

const periods = [
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1A', value: '1y' },
]

let chart = null

const loadProduct = async () => {
  try {
    const symbol = route.params.symbol
    if (!symbol) {
      console.error('❌ No se proporcionó símbolo')
      router.push('/market')
      return
    }
    // Buscar en MARKET_SYMBOLS primero
    // const fromConstants = MARKET_SYMBOLS.find((s) => s.symbol === route.params.symbol)
    const fromConstants = MARKET_SYMBOLS.find((s) => s.symbol === symbol)

    if (fromConstants) {
      product.value = {
        ...fromConstants,
        precio: 100.0 + Math.random() * 100,
        variacion: parseFloat((Math.random() * 10 - 5).toFixed(2)),
        volumen: Math.floor(Math.random() * 10000000),
        timestamp: new Date().toISOString(),
      }

      // Add to history
      historyStore.addToHistory({
        type: 'view',
        product: product.value,
        timestamp: new Date().toISOString(),
      })

      // Load historical data for chart
      loadHistoricalData()
      loadTechnicalIndicators()
    } else {
      console.warn(`⚠️ Símbolo no encontrado: ${symbol}`)
      router.push('/market')
    }
  } catch (error) {
    console.error('Error loading product:', error)
    router.push('/market')
  }
}

const loadHistoricalData = async () => {
  if (!product.value) return

  try {
    const historicalData = await getDailyTimeSeries(product.value.simbolo)

    if (historicalData.length && chartCanvas.value) {
      // Filtrar por período seleccionado
      let filteredData = historicalData
      const today = new Date()

      if (selectedPeriod.value === '1m') {
        const cutoff = new Date(today.setMonth(today.getMonth() - 1))
        filteredData = historicalData.filter((d) => new Date(d.date) >= cutoff)
      } else if (selectedPeriod.value === '3m') {
        const cutoff = new Date(today.setMonth(today.getMonth() - 3))
        filteredData = historicalData.filter((d) => new Date(d.date) >= cutoff)
      } else if (selectedPeriod.value === '6m') {
        const cutoff = new Date(today.setMonth(today.getMonth() - 6))
        filteredData = historicalData.filter((d) => new Date(d.date) >= cutoff)
      } else if (selectedPeriod.value === '1y') {
        const cutoff = new Date(today.setFullYear(today.getFullYear() - 1))
        filteredData = historicalData.filter((d) => new Date(d.date) >= cutoff)
      }

      const dates = filteredData.map((d) => d.date)
      const prices = filteredData.map((d) => d.close)

      if (chart) chart.destroy()

      chart = new Chart(chartCanvas.value, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Precio de Cierre',
              data: prices,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: 'white' },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              ticks: { color: 'white', maxRotation: 45, minRotation: 45 },
              grid: { color: 'rgba(255,255,255,0.1)' },
            },
            y: {
              ticks: { color: 'white' },
              grid: { color: 'rgba(255,255,255,0.1)' },
            },
          },
        },
      })
    }
  } catch (error) {
    console.error('Error loading historical data:', error)
  }
}

const loadTechnicalIndicators = async () => {
  if (!product.value) return

  try {
    const sma20 = await getSMA(product.value.simbolo, 'daily', 20)
    const sma50 = await getSMA(product.value.simbolo, 'daily', 50)

    if (sma20.length && sma50.length) {
      const lastSMA20 = sma20[sma20.length - 1]?.sma || 0
      const lastSMA50 = sma50[sma50.length - 1]?.sma || 0

      technicalIndicators.value = [
        {
          name: 'SMA 20',
          value: formatPrice(lastSMA20),
          trend: lastSMA20 > lastSMA50 ? 'up' : lastSMA20 < lastSMA50 ? 'down' : 'neutral',
        },
        {
          name: 'SMA 50',
          value: formatPrice(lastSMA50),
          trend: lastSMA50 > lastSMA20 ? 'up' : lastSMA50 < lastSMA20 ? 'down' : 'neutral',
        },
        {
          name: 'RSI (14)',
          value: (40 + Math.random() * 30).toFixed(2),
          trend: 'neutral',
        },
        {
          name: 'Volumen',
          value: formatVolume(product.value.volumen || 0),
          trend: 'neutral',
        },
      ]
    }
  } catch (error) {
    console.error('Error loading technical indicators:', error)
  }
}

const changePeriod = (period) => {
  selectedPeriod.value = period
  loadHistoricalData()
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const formatVolume = (volume) => {
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(1) + 'M'
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K'
  }
  return volume.toString()
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('es-CL')
}

const getSectorBadge = (sector) => {
  const badges = {
    Tecnología: 'bg-primary',
    Consumo: 'bg-success',
    Automotriz: 'bg-warning text-dark',
    Financiero: 'bg-info text-dark',
    Salud: 'bg-danger',
  }
  return badges[sector] || 'bg-secondary'
}

const handleBuy = () => {
  if (product.value) {
    portfolioStore.addToPortfolio(product.value)
    historyStore.addToHistory({
      type: 'buy',
      product: product.value,
      timestamp: new Date().toISOString(),
    })
  }
}

const handleSell = () => {
  if (product.value) {
    portfolioStore.removeFromPortfolio(product.value.simbolo)
    historyStore.addToHistory({
      type: 'sell',
      product: product.value,
      timestamp: new Date().toISOString(),
    })
  }
}

const addToWatchlist = () => {
  alert('Funcionalidad en desarrollo')
}

const goToNews = () => {
  router.push(`/news?q=${product.value?.nombre}`)
}

onMounted(() => {
  loadProduct()
})

watch(
  () => route.params.symbol,
  () => {
    loadProduct()
  },
)
</script>

<style scoped>
canvas {
  max-height: 400px;
  width: 100% !important;
}

.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}
</style>
