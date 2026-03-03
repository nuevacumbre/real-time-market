import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar vistas
import HomePage from '@/views/HomePage.vue'
import MarketPage from '@/views/MarketPage.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import NewsPage from '@/views/NewsPage.vue'
import NewsDetail from '@/views/NewsDetail.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import CryptoPage from '@/views/CryptoPage.vue'
// Nuevas vistas
import ProfilePage from '@/views/ProfilePage.vue'
import PortfolioPage from '@/views/PortfolioPage.vue'
// Determinar base URL para el history mode
// En desarrollo: '/'
// En producción: el valor de import.meta.env.BASE_URL (configurado en vite.config.js)
const baseUrl = import.meta.env.BASE_URL || '/'

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/market',
      name: 'market',
      component: MarketPage,
    },
    {
      path: '/product/:symbol',
      name: 'product-detail',
      component: ProductDetail,
      props: true,
    },
    {
      path: '/news',
      name: 'news',
      component: NewsPage,
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: NewsDetail,
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioPage,
      meta: { requiresAuth: true },
    },
    // Ruta comodín para 404 - Opcional
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
    {
      path: '/crypto',
      name: 'crypto',
      component: CryptoPage,
    },
    // Agregar esta ruta si quieres una sección de criptomonedas
    /*{
      path: '/crypto',
      name: 'crypto',
      component: () => import('@/views/CryptoPage.vue'),
    },*/
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards - SIN next()
router.beforeEach((to, _from) => {
  const authStore = useAuthStore()

  // Si la ruta requiere autenticación y el usuario NO está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirigir a login con query param para volver después
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // Si la ruta es para invitados (login/register) y el usuario SÍ está autenticado
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirigir al dashboard
    return { name: 'dashboard' }
  }

  // Permitir navegación
  return true
})

export default router
