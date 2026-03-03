import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import NavBar from '../NavBar.vue'

// Mock de componentes para evitar errores de Firebase
vi.mock('@/services/firebase', () => ({
  auth: {},
  db: {},
}))

// Crear un router mock
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/market', name: 'market', component: { template: '<div>Market</div>' } },
    { path: '/news', name: 'news', component: { template: '<div>News</div>' } },
    { path: '/crypto', name: 'crypto', component: { template: '<div>Crypto</div>' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
    { path: '/register', name: 'register', component: { template: '<div>Register</div>' } },
  ],
})

describe('NavBar', () => {
  it('renderiza correctamente cuando el usuario NO está autenticado', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: null,
                isAuthenticated: false,
                userEmail: '',
              },
            },
          }),
          router,
        ],
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          },
          'router-view': true,
        },
      },
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    const text = wrapper.text()

    // Verificaciones
    expect(text).toContain('Inicio')
    expect(text).toContain('Mercado')
    expect(text).toContain('Noticias')
    expect(text).toContain('Cripto')
    expect(text).toContain('Explorar')
    expect(text).toContain('Iniciar Sesión')
    expect(text).toContain('Registrarse')
    expect(text).not.toContain('Dashboard')
    expect(text).not.toContain('Cerrar Sesión')
  })

  it('renderiza correctamente cuando el usuario está autenticado', async () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: { email: 'test@example.com' },
                isAuthenticated: true,
                userEmail: 'test@example.com',
              },
            },
          }),
          router,
        ],
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          },
          'router-view': true,
        },
      },
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    const text = wrapper.text()

    // Verificaciones
    expect(text).toContain('Inicio')
    expect(text).toContain('Mercado')
    expect(text).toContain('Noticias')
    expect(text).toContain('Cripto')
    expect(text).toContain('Dashboard')
    expect(text).toContain('Cerrar Sesión')
    expect(text).toContain('test') // El email aparece como "test"
    expect(text).not.toContain('Iniciar Sesión')
    expect(text).not.toContain('Registrarse')
  })
})
