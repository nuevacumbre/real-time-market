import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/config/constants'

export const usePortfolioStore = defineStore('portfolio', {
  state: () => ({
    items: [],
    totalValue: 0,
  }),

  getters: {
    itemCount: (state) => state.items.length,
    getItemBySymbol: (state) => (symbol) => {
      return state.items.find((item) => item.symbol === symbol)
    },
  },

  actions: {
    loadFromStorage() {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO)
      if (saved) {
        this.items = JSON.parse(saved)
        this.calculateTotal()
      }
    },

    saveToStorage() {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(this.items))
    },

    addToPortfolio(product, quantity = 1) {
      const existing = this.items.find((item) => item.symbol === product.simbolo)

      if (existing) {
        existing.quantity += quantity
        existing.total = existing.quantity * product.precio
      } else {
        this.items.push({
          symbol: product.simbolo,
          name: product.nombre,
          quantity,
          price: product.precio,
          total: product.precio * quantity,
        })
      }

      this.calculateTotal()
      this.saveToStorage()
    },

    removeFromPortfolio(symbol, quantity = 1) {
      const index = this.items.findIndex((item) => item.symbol === symbol)

      if (index !== -1) {
        if (this.items[index].quantity <= quantity) {
          this.items.splice(index, 1)
        } else {
          this.items[index].quantity -= quantity
          this.items[index].total = this.items[index].quantity * this.items[index].price
        }

        this.calculateTotal()
        this.saveToStorage()
      }
    },

    calculateTotal() {
      this.totalValue = this.items.reduce((sum, item) => sum + item.total, 0)
    },

    clearPortfolio() {
      this.items = []
      this.totalValue = 0
      this.saveToStorage()
    },
  },
})
