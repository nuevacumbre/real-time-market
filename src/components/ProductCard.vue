<template>
  <div class="card h-100 shadow-sm" :class="{ 'border-primary': product.variacion > 2 }">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title">{{ product.nombre }}</h5>
        <span class="badge" :class="getSectorBadge(product.sector)">{{ product.sector }}</span>
      </div>

      <h6 class="text-muted">{{ product.simbolo }}</h6>

      <hr />

      <div class="row text-center">
        <div class="col-6">
          <small class="text-muted">Precio</small>
          <h5 class="mb-0">${{ formatPrice(product.precio) }}</h5>
        </div>
        <div class="col-6">
          <small class="text-muted">Variación</small>
          <h5 class="mb-0" :class="product.variacion >= 0 ? 'text-success' : 'text-danger'">
            {{ product.variacion >= 0 ? '+' : '' }}{{ product.variacion }}%
          </h5>
        </div>
      </div>

      <hr />

      <div class="d-flex justify-content-between">
        <!-- flex-grow-1. en taildwind y flex-fill para bootstrap-->
        <button class="btn btn-success btn-sm flex-fill me-2" @click="handleBuy">
          <i class="bi bi-cart-plus"></i> Comprar
        </button>
        <button class="btn btn-warning btn-sm flex-fill" @click="handleSell">
          <i class="bi bi-cart-dash"></i> Vender
        </button>
      </div>

      <router-link
        :to="`/product/${product.simbolo}`"
        class="btn btn-outline-primary btn-sm w-100 mt-2"
      >
        Ver Detalles
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { usePortfolioStore } from '@/stores/portfolio'
import { useHistoryStore } from '@/stores/history'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const portfolioStore = usePortfolioStore()
const historyStore = useHistoryStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
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
  portfolioStore.addToPortfolio(props.product)
  historyStore.addToHistory({
    type: 'buy',
    product: props.product,
    timestamp: new Date().toISOString(),
  })
}

const handleSell = () => {
  portfolioStore.removeFromPortfolio(props.product.simbolo)
  historyStore.addToHistory({
    type: 'sell',
    product: props.product,
    timestamp: new Date().toISOString(),
  })
}
</script>
