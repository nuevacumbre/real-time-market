import { defineStore } from 'pinia'
import { auth } from '@/services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { sanitizeInput } from '@/utils/sanitize'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
  },

  actions: {
    initAuthListener() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        this.loading = false
      })
    },

    async register(email, password) {
      this.loading = true
      this.error = null

      try {
        const sanitizedEmail = sanitizeInput(email)

        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres')
        }

        const userCredential = await createUserWithEmailAndPassword(auth, sanitizedEmail, password)

        this.user = userCredential.user
        return { success: true, user: userCredential.user }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const sanitizedEmail = sanitizeInput(email)
        const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password)

        this.user = userCredential.user
        return { success: true, user: userCredential.user }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
        return { success: true }
      } catch (err) {
        return { success: false, error: err.message }
      }
    },
  },
})
