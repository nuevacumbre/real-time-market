<template>
  <div class="card h-100 shadow-sm bg-dark text-white">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title">{{ crypto.name }}</h5>
        <span class="badge bg-warning text-dark">{{ crypto.symbol }}</span>
      </div>

      <hr />

      <div class="row text-center">
        <div class="col-12">
          <small class="text-white-50">Precio (USD)</small>
          <h3 class="mb-0">${{ formatPrice(crypto.rate) }}</h3>
        </div>
      </div>

      <hr />

      <div class="d-flex justify-content-between">
        <small class="text-white-50">Actualizado:</small>
        <small class="text-white-50">{{ formatTime(crypto.lastRefreshed) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  crypto: {
    type: Object,
    required: true,
  },
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleTimeString('es-CL')
}
</script>
