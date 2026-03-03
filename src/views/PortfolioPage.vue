<template>
  <div class="container">
    <h2 class="text-white mb-4"><i class="bi bi-briefcase"></i> Mi Portafolio</h2>

    <div class="card bg-dark text-white">
      <div class="card-body">
        <div v-if="portfolio.items.length === 0" class="text-center py-5">
          <i class="bi bi-briefcase" style="font-size: 4rem"></i>
          <p class="text-white-50 mt-3">No tienes activos en tu portafolio</p>
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
                  <th>Acción</th>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePortfolioStore } from '@/stores/portfolio'

const portfolio = usePortfolioStore()

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2 }).format(price)
}

const removeItem = (symbol) => {
  portfolio.removeFromPortfolio(symbol, 9999)
}
</script>
