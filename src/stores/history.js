import { defineStore } from 'pinia'
import { STORAGE_KEYS, APP_CONFIG } from '@/config/constants'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    recentlyViewed: [],
    transactions: [],
  }),

  getters: {
    getRecentProducts: (state) => {
      return state.recentlyViewed
        .filter((item) => item && item.product)
        .map((item) => ({
          ...item,
          product: {
            ...item.product,
            // SOLO asignar valores por defecto si NO existen
            nombre: item.product.nombre || item.product.name || 'Producto',
            simbolo: item.product.simbolo || item.product.symbol || 'N/A',
            precio: item.product.precio ?? 100,
            variacion: item.product.variacion ?? 0,
          },
        }))
        .slice(0, APP_CONFIG.maxRecentlyViewed)
    },

    getRecentTransactions: (state) => {
      return state.transactions.filter((t) => t).slice(0, 10)
    },
  },

  actions: {
    loadFromStorage() {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED)
        if (saved) {
          const parsed = JSON.parse(saved)
          this.recentlyViewed = Array.isArray(parsed) ? parsed : []
        } else {
          this.recentlyViewed = []
        }
      } catch (error) {
        console.error('Error loading history:', error)
        this.recentlyViewed = []
      }
    },

    addToHistory(item) {
      if (!item || !item.type) return

      if (item.type === 'view' && item.product) {
        // NO modificar los nombres, mantener los originales
        const validProduct = { ...item.product }

        const existingIndex = this.recentlyViewed.findIndex(
          (v) =>
            v.product?.simbolo === validProduct.simbolo ||
            v.product?.symbol === validProduct.simbolo,
        )

        if (existingIndex !== -1) {
          this.recentlyViewed.splice(existingIndex, 1)
        }

        this.recentlyViewed.unshift({
          product: validProduct,
          timestamp: item.timestamp || new Date().toISOString(),
        })

        if (this.recentlyViewed.length > APP_CONFIG.maxRecentlyViewed) {
          this.recentlyViewed = this.recentlyViewed.slice(0, APP_CONFIG.maxRecentlyViewed)
        }

        try {
          localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(this.recentlyViewed))
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }

      if (item.type === 'buy' || item.type === 'sell') {
        this.transactions.unshift(item)
        if (this.transactions.length > 50) {
          this.transactions = this.transactions.slice(0, 50)
        }
      }
    },

    clearHistory() {
      this.recentlyViewed = []
      this.transactions = []
      localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED)
    },
  },
})
