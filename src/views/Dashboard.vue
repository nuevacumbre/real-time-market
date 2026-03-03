<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col">
        <div class="card bg-dark text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h2 class="mb-1">
                  <i class="bi bi-person-circle"></i> Bienvenido, {{ authStore.userEmail }}
                </h2>
                <p class="text-white-50 mb-0">Último acceso: {{ lastAccess }}</p>
              </div>
              <button class="btn btn-outline-danger" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Portfolio Summary -->
      <div class="col-md-6 mb-4">
        <div class="card bg-dark text-white h-100">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-briefcase"></i> Mi Portafolio</h5>
          </div>
          <div class="card-body">
            <div v-if="portfolio.items.length === 0" class="text-center py-4">
              <i class="bi bi-briefcase fs-1 text-white-50"></i>
              <p class="text-white-50 mt-3">No tienes activos en tu portafolio.</p>
              <router-link to="/market" class="btn btn-primary">
                <i class="bi bi-cart"></i> Ir al Mercado
              </router-link>
            </div>

            <div v-else>
              <div class="table-responsive">
                <table class="table table-dark table-hover">
                  <thead>
                    <tr>
                      <th>Activo</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in portfolio.items" :key="item.symbol">
                      <td>{{ item.symbol }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>${{ formatPrice(item.price) }}</td>
                      <td>${{ formatPrice(item.total) }}</td>
                      <td>
                        <button class="btn btn-sm btn-danger" @click="removeItem(item.symbol)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="table-active">
                      <th colspan="3" class="text-end">Total:</th>
                      <th>${{ formatPrice(portfolio.totalValue) }}</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <button class="btn btn-warning mt-3" @click="clearPortfolio">
                <i class="bi bi-arrow-counterclockwise"></i> Limpiar Portafolio
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="col-md-6 mb-4">
        <div class="card bg-dark text-white h-100">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-clock-history"></i> Actividad Reciente</h5>
          </div>
          <div class="card-body">
            <div v-if="recentTransactions.length === 0" class="text-center py-4">
              <i class="bi bi-calendar-x fs-1 text-white-50"></i>
              <p class="text-white-50 mt-3">No hay actividad reciente.</p>
            </div>

            <div v-else class="list-group list-group-flush">
              <div
                v-for="(transaction, index) in recentTransactions"
                :key="index"
                class="list-group-item bg-transparent text-white border-secondary"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span
                      class="badge"
                      :class="transaction.type === 'buy' ? 'bg-success' : 'bg-warning'"
                    >
                      {{ transaction.type === 'buy' ? 'COMPRA' : 'VENTA' }}
                    </span>
                    <strong class="ms-2">{{
                      transaction.product?.simbolo || transaction.product?.symbol || 'N/A'
                    }}</strong>
                  </div>
                  <small class="text-white-50">{{ formatTime(transaction.timestamp) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <NewsHistory title="Mis Últimas Lecturas" />
      </div>
    </div>

    <!-- Recently Viewed Products -->
    <div class="row" v-if="recentProducts.length > 0">
      <div class="col-12">
        <div class="card bg-dark text-white">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-eye"></i> Vistos Recientemente</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div
                class="col-md-3 mb-3"
                v-for="item in recentProducts"
                :key="item?.product?.simbolo || Math.random()"
              >
                <!--ProductCard :product="item.product" /-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay productos recientes -->
    <div v-else class="row mt-4">
      <div class="col-12">
        <div class="card bg-dark text-white">
          <div class="card-body text-center py-4">
            <i class="bi bi-eye-slash fs-1 text-white-50"></i>
            <p class="text-white-50 mt-3">No has visto ningún producto recientemente</p>
            <router-link to="/market" class="btn btn-primary">
              <i class="bi bi-graph-up"></i> Explorar Mercado
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePortfolioStore } from '@/stores/portfolio'
import { useHistoryStore } from '@/stores/history'
import { useNewsHistoryStore } from '@/stores/newsHistory'
import { useRouter } from 'vue-router'
//import ProductCard from '@/components/ProductCard.vue'
import NewsHistory from '@/components/NewsHistory.vue'

const authStore = useAuthStore()
const portfolioStore = usePortfolioStore()
const historyStore = useHistoryStore()
const newsHistoryStore = useNewsHistoryStore() // Aseguramos que el store de historial de noticias también esté disponible para cargar el historial de lectura
const router = useRouter()

const lastAccess = ref(new Date().toLocaleString('es-CL'))

const portfolio = computed(() => ({
  items: portfolioStore.items,
  totalValue: portfolioStore.totalValue,
}))

const recentTransactions = computed(() => {
  return (historyStore.getRecentTransactions || []).slice(0, 10)
})

const recentProducts = computed(() => {
  try {
    return (historyStore.getRecentProducts || [])
      .filter((item) => item && item.product) // Filtrar items válidos
      .map((item) => ({
        ...item,
        product: {
          ...item.product,
          precio: item.product.precio || 100, // Valor por defecto
          variacion: item.product.variacion || 0, // Valor por defecto
        },
      }))
  } catch (error) {
    console.error('Error cargando productos recientes:', error)
    return []
  }
  //return historyStore.getRecentProducts
})

/*const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}*/

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) return '0.00'
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleTimeString('es-CL')
}

const removeItem = (symbol) => {
  portfolioStore.removeFromPortfolio(symbol, 9999)
}

const clearPortfolio = () => {
  if (confirm('¿Estás seguro de limpiar todo tu portafolio?')) {
    portfolioStore.clearPortfolio()
  }
}

const logout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(() => {
  portfolioStore.loadFromStorage()
  historyStore.loadFromStorage()
  newsHistoryStore.loadUserHistory()
})
</script>
