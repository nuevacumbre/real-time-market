<template>
  <div class="container">
    <!-- Hero Section -->
    <div class="row justify-content-center mb-5">
      <div class="col-lg-8 text-center">
        <h1 class="display-3 fw-bold text-white mb-4">📈 Real-Time Market</h1>
        <p class="lead text-white-50 mb-4">
          Plataforma educativa de trading con datos en tiempo real, análisis de mercado y noticias
          financieras.
        </p>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <router-link to="/market" class="btn btn-primary btn-lg px-4"> Ver Mercado </router-link>
          <router-link to="/news" class="btn btn-outline-light btn-lg px-4">
            Leer Noticias
          </router-link>
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="btn btn-success btn-lg px-4"
          >
            <i class="bi bi-person-plus"></i> Registrarse
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="row g-4">
      <div class="col-md-4" v-for="feature in features" :key="feature.title">
        <div class="card h-100 bg-dark text-white border-0 shadow">
          <div class="card-body text-center p-4">
            <div class="display-1 mb-3">{{ feature.icon }}</div>
            <h3 class="h4">{{ feature.title }}</h3>
            <p class="text-white-50">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recently Viewed (solo si hay productos) -->
    <div class="row mt-5" v-if="recentProducts && recentProducts.length > 0">
      <div class="col-12">
        <h3 class="text-white mb-4"><i class="bi bi-clock-history"></i> Vistos Recientemente</h3>
      </div>
      <div
        class="col-md-3 mb-3"
        v-for="item in recentProducts"
        :key="item?.product?.simbolo || item?.product?.symbol || Math.random()"
      >
        <ProductCard v-if="item?.product" :product="item.product" />
      </div>
    </div>

    <!-- Mensaje si no hay productos recientes y usuario autenticado -->
    <div v-else-if="authStore.isAuthenticated" class="row mt-5">
      <div class="col-12 text-center text-white-50">
        <i class="bi bi-eye-slash fs-1"></i>
        <p class="mt-3">No has visto ningún producto recientemente</p>
        <router-link to="/market" class="btn btn-primary">
          <i class="bi bi-graph-up"></i> Explorar Mercado
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHistoryStore } from '@/stores/history'
import ProductCard from '@/components/ProductCard.vue'

const authStore = useAuthStore()
const historyStore = useHistoryStore()

const recentProducts = computed(() => {
  try {
    const items = historyStore.getRecentProducts || []
    // Filtrar items que tengan product definido
    //return items.filter((item) => item && item.product)
    // Asegurar que los productos tengan todos los datos necesarios
    return items
      .filter((item) => item && item.product)
      .map((item) => ({
        ...item,
        product: {
          ...item.product,
          // Valores por defecto si faltan
          nombre: item.product.nombre || 'Producto',
          simbolo: item.product.simbolo || 'N/A',
          precio: item.product.precio || 100,
          variacion: item.product.variacion || 0,
          sector: item.product.sector || 'General',
        },
      }))
  } catch (error) {
    console.error('Error cargando productos recientes:', error)
    return []
  }
  //return historyStore.getRecentProducts.map((item) => item.product)
})

const features = [
  {
    icon: '📊',
    title: 'Datos en Tiempo Real',
    description: 'Accede a información actualizada de Yahoo Finance con actualización automática.',
  },
  {
    icon: '📰',
    title: 'Blog de Noticias',
    description: 'Lee y comenta las últimas noticias del mercado financiero.',
  },
  {
    icon: '🔐',
    title: 'Sistema Seguro',
    description: 'Autenticación con Firebase y sanitización de datos para máxima seguridad.',
  },
]
</script>
