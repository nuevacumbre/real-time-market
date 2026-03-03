import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import NavBar from '../NavBar.vue'

describe('NavBar', () => {
  it('renders correctly when user is not authenticated', () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: { user: null },
            },
          }),
        ],
        stubs: ['router-link'],
      },
    })

    expect(wrapper.find('.navbar-brand').text()).toContain('Real-Time Market')
    expect(wrapper.text()).toContain('Iniciar Sesión')
    expect(wrapper.text()).toContain('Registrarse')
  })

  it('renders correctly when user is authenticated', () => {
    const wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: { user: { email: 'test@example.com' } },
            },
          }),
        ],
        stubs: ['router-link'],
      },
    })

    expect(wrapper.text()).toContain('test@example.com')
    expect(wrapper.text()).toContain('Cerrar Sesión')
  })
})
