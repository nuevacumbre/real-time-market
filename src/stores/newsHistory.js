// src/stores/newsHistory.js
import { defineStore } from 'pinia'
import { db } from '@/services/firebase'
import { collection, addDoc, query, where, orderBy, getDocs, limit } from 'firebase/firestore'
import { useAuthStore } from './auth'

export const useNewsHistoryStore = defineStore('newsHistory', {
  state: () => ({
    viewedNews: [],
    loading: false,
  }),

  getters: {
    getRecentNews: (state) => {
      // Eliminar duplicados por newsId y mantener solo los más recientes
      const unique = {}
      state.viewedNews.forEach((item) => {
        if (
          !unique[item.newsId] ||
          new Date(item.viewedAt) > new Date(unique[item.newsId].viewedAt)
        ) {
          unique[item.newsId] = item
        }
      })
      return Object.values(unique)
        .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
        .slice(0, 5)
    },

    getViewedByUser: (state) => (userId) => {
      return state.viewedNews.filter((item) => item.userId === userId)
    },
  },

  actions: {
    // Registrar vista de noticia
    async trackNewsView(newsId, newsTitle, newsCategory) {
      const authStore = useAuthStore()

      if (!authStore.isAuthenticated) return null

      try {
        const viewData = {
          userId: authStore.user.uid,
          userEmail: authStore.user.email,
          newsId,
          newsTitle,
          newsCategory,
          viewedAt: new Date().toISOString(),
          timestamp: new Date(),
        }

        // Guardar en Firestore
        const historyCollection = collection(db, 'newsHistory')
        const docRef = await addDoc(historyCollection, viewData)

        // Actualizar estado local eliminando duplicados
        this.viewedNews = this.viewedNews.filter((item) => item.newsId !== newsId)
        this.viewedNews.unshift({
          id: docRef.id,
          ...viewData,
        })

        // Mantener solo los últimos 20
        if (this.viewedNews.length > 20) {
          this.viewedNews = this.viewedNews.slice(0, 20)
        }

        console.log('📝 Vista de noticia registrada:', newsTitle)
        return docRef.id
      } catch (error) {
        console.error('Error registrando vista:', error)
        return null
      }
    },

    // Cargar historial del usuario actual
    async loadUserHistory() {
      const authStore = useAuthStore()

      if (!authStore.isAuthenticated) {
        this.viewedNews = []
        return
      }

      this.loading = true

      try {
        const historyCollection = collection(db, 'newsHistory')
        const q = query(
          historyCollection,
          where('userId', '==', authStore.user.uid),
          orderBy('viewedAt', 'desc'),
          limit(20),
        )

        const snapshot = await getDocs(q)

        // Eliminar duplicados por newsId
        const uniqueMap = {}
        snapshot.docs.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() }
          if (
            !uniqueMap[data.newsId] ||
            new Date(data.viewedAt) > new Date(uniqueMap[data.newsId].viewedAt)
          ) {
            uniqueMap[data.newsId] = data
          }
        })

        this.viewedNews = Object.values(uniqueMap).sort(
          (a, b) => new Date(b.viewedAt) - new Date(a.viewedAt),
        )

        console.log(`✅ Historial cargado: ${this.viewedNews.length} noticias únicas`)
      } catch (error) {
        console.error('Error cargando historial:', error)
        this.viewedNews = []
      } finally {
        this.loading = false
      }
    },

    // Limpiar historial local
    clearHistory() {
      this.viewedNews = []
    },
  },
})
