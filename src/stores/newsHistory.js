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
    getRecentNews: (state) => state.viewedNews.slice(0, 5),

    getViewedByUser: (state) => (userId) => {
      return state.viewedNews.filter((item) => item.userId === userId)
    },
  },

  actions: {
    // Registrar vista de noticia
    async trackNewsView(newsId, newsTitle, newsCategory) {
      const authStore = useAuthStore()

      // Solo registrar si el usuario está autenticado
      if (!authStore.isAuthenticated) return null

      try {
        const viewData = {
          userId: authStore.user.uid,
          userEmail: authStore.user.email,
          newsId,
          newsTitle,
          newsCategory,
          viewedAt: new Date().toISOString(),
          timestamp: new Date(), // Para ordenamiento en Firebase
        }

        // Guardar en Firestore
        const historyCollection = collection(db, 'newsHistory')
        const docRef = await addDoc(historyCollection, viewData)

        // Agregar al estado local
        this.viewedNews.unshift({
          id: docRef.id,
          ...viewData,
        })

        // Mantener solo los últimos 20 en memoria
        if (this.viewedNews.length > 20) {
          this.viewedNews.pop()
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
        this.viewedNews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        console.log(`✅ Historial cargado: ${this.viewedNews.length} noticias`)
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
