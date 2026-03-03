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
        .filter((item) => item && item.product) // Filtrar items válidos
        .map((item) => ({
          ...item,
          product: {
            ...item.product,
            // Asegurar que precio y variación tengan valores por defecto
            precio: item.product.precio || 0,
            variacion: item.product.variacion || 0,
          },
        }))
        .slice(0, APP_CONFIG.maxRecentlyViewed)
    },

    getRecentTransactions: (state) => {
      return state.transactions
        .filter((t) => t) // Filtrar transacciones nulas
        .slice(0, 10)
    },
  },

  actions: {
    loadFromStorage() {
      try {
        // Load recently viewed
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

      // Add to recently viewed
      if (item.type === 'view' && item.product) {
        // Validar que el producto tenga los campos necesarios
        const validProduct = {
          ...item.product,
          precio: item.product.precio || 100 + Math.random() * 100,
          variacion: item.product.variacion || parseFloat((Math.random() * 10 - 5).toFixed(2)),
        }

        const existingIndex = this.recentlyViewed.findIndex(
          (v) => v.product?.simbolo === validProduct.simbolo,
        )

        if (existingIndex !== -1) {
          this.recentlyViewed.splice(existingIndex, 1)
        }

        this.recentlyViewed.unshift({
          product: validProduct,
          timestamp: item.timestamp || new Date().toISOString(),
        })

        // Keep only max items
        if (this.recentlyViewed.length > APP_CONFIG.maxRecentlyViewed * 2) {
          this.recentlyViewed = this.recentlyViewed.slice(0, APP_CONFIG.maxRecentlyViewed)
        }

        // Guardar en localStorage
        try {
          localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(this.recentlyViewed))
        } catch (error) {
          console.error('Error saving to localStorage:', error)
        }
      }

      // Add to transactions
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
