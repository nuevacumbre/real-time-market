import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ProductCard from '../ProductCard.vue'

describe('ProductCard', () => {
  const mockProduct = {
    nombre: 'Apple Inc.',
    simbolo: 'AAPL',
    precio: 175.5,
    variacion: 2.34,
    sector: 'Tecnología',
  }

  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['router-link'],
      },
    })

    expect(wrapper.text()).toContain('Apple Inc.')
    expect(wrapper.text()).toContain('AAPL')
    expect(wrapper.text()).toContain('175.50')
    expect(wrapper.text()).toContain('+2.34%')
    expect(wrapper.text()).toContain('Tecnología')
  })

  it('applies correct color for positive variation', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['router-link'],
      },
    })

    const variationElement = wrapper.find('.text-success')
    expect(variationElement.exists()).toBe(true)
  })

  it('applies correct color for negative variation', () => {
    const negativeProduct = { ...mockProduct, variacion: -1.5 }
    const wrapper = mount(ProductCard, {
      props: {
        product: negativeProduct,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['router-link'],
      },
    })

    const variationElement = wrapper.find('.text-danger')
    expect(variationElement.exists()).toBe(true)
  })
})
