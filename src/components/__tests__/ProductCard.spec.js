import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import ProductCard from '../ProductCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/product/:symbol',
      name: 'product-detail',
      component: { template: '<div>Product</div>' },
    },
  ],
})

describe('ProductCard', () => {
  const mockProduct = {
    id: 'AAPL',
    nombre: 'Apple Inc.',
    simbolo: 'AAPL',
    precio: 175.5,
    variacion: 2.34,
    sector: 'Tecnología',
  }

  it('muestra la información del producto correctamente', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), router],
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    })

    await router.isReady()

    const text = wrapper.text()
    expect(text).toContain('Apple Inc.')
    expect(text).toContain('AAPL')
    // Buscar el precio con formato chileno (coma)
    expect(text).toContain('$175,50')
    expect(text).toContain('+2.34%')
    expect(text).toContain('Tecnología')
  })

  it('aplica clase de éxito cuando la variación es positiva', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), router],
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    })

    await router.isReady()

    const variationElement = wrapper.find('.text-success')
    expect(variationElement.exists()).toBe(true)
  })

  it('aplica clase de peligro cuando la variación es negativa', async () => {
    const negativeProduct = { ...mockProduct, variacion: -1.5 }
    const wrapper = mount(ProductCard, {
      props: { product: negativeProduct },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), router],
        stubs: {
          'router-link': true,
          'router-view': true,
        },
      },
    })

    await router.isReady()

    const variationElement = wrapper.find('.text-danger')
    expect(variationElement.exists()).toBe(true)
  })
})
