/**
 * Servicio avanzado de Alpha Vantage API
 * Documentación: https://www.alphavantage.co/documentation/
 *
 * Incluye:
 * - Noticias y sentimiento
 * - Indicadores económicos
 * - Commodities
 * - Forex
 */

//import { ALPHA_VANTAGE_CONFIG } from '@/config/constants'

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY
const BASE_URL = 'https://www.alphavantage.co/query'

if (!API_KEY) {
  console.error('❌ ALPHA VANTAGE API KEY no encontrada')
}

/**
 * Función genérica para peticiones
 */
const fetchFromAlphaVantage = async (params) => {
  const queryParams = new URLSearchParams({
    ...params,
    apikey: API_KEY,
  })

  const url = `${BASE_URL}?${queryParams.toString()}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }

    if (data['Note']) {
      console.warn('⚠️ Rate limit:', data['Note'])
      return null
    }

    return data
  } catch (error) {
    console.error('❌ Alpha Vantage error:', error)
    return null
  }
}

/**
 * NEWS_SENTIMENT - Noticias y sentimiento de mercado
 */
export const getNewsSentiment = async (tickers = null, topics = null, timeFrom = null) => {
  const params = {
    function: 'NEWS_SENTIMENT',
  }

  if (tickers) params.tickers = tickers
  if (topics) params.topics = topics
  if (timeFrom) params.time_from = timeFrom

  const data = await fetchFromAlphaVantage(params)

  if (!data || !data.feed) {
    // Datos de ejemplo
    return generateMockNews()
  }

  return data.feed.map((item) => ({
    title: item.title,
    summary: item.summary,
    url: item.url,
    source: item.source,
    publishedAt: item.time_published,
    sentiment: item.overall_sentiment_score,
    sentimentLabel: item.overall_sentiment_label,
    tickers:
      item.ticker_sentiment?.map((t) => ({
        ticker: t.ticker,
        sentiment: t.ticker_sentiment_score,
      })) || [],
  }))
}

/**
 * TOP_GAINERS_LOSERS - Activos con mayores ganancias/pérdidas
 */
export const getGainersLosers = async () => {
  const data = await fetchFromAlphaVantage({
    function: 'TOP_GAINERS_LOSERS',
  })

  if (!data) {
    return generateMockGainersLosers()
  }

  return {
    gainers: data.top_gainers || [],
    losers: data.top_losers || [],
    mostActive: data.most_actively_traded || [],
  }
}

/**
 * REAL_GDP - Producto Interno Bruto real
 */
export const getRealGDP = async (interval = 'annual') => {
  const data = await fetchFromAlphaVantage({
    function: 'REAL_GDP',
    interval,
  })

  if (!data || !data.data) {
    // Datos de ejemplo
    return generateMockEconomicData('GDP')
  }

  return data.data
}

/**
 * CPI - Índice de Precios al Consumidor
 */
export const getCPI = async (interval = 'monthly') => {
  const data = await fetchFromAlphaVantage({
    function: 'CPI',
    interval,
  })

  if (!data || !data.data) {
    return generateMockEconomicData('CPI')
  }

  return data.data
}

/**
 * TREASURY_YIELD - Rendimiento de bonos del tesoro
 */
export const getTreasuryYield = async (interval = 'daily', maturity = '10year') => {
  const data = await fetchFromAlphaVantage({
    function: 'TREASURY_YIELD',
    interval,
    maturity,
  })

  if (!data || !data.data) {
    return generateMockEconomicData('Treasury')
  }

  return data.data
}

/**
 * WTI - Precio del petróleo WTI
 */
export const getOilPrice = async (interval = 'daily') => {
  const data = await fetchFromAlphaVantage({
    function: 'WTI',
    interval,
  })

  if (!data || !data.data) {
    return generateMockCommodityData('Oil')
  }

  return data.data
}

/**
 * GOLD_SILVER_SPOT - Precio spot del oro y plata
 */
export const getGoldSilverSpot = async () => {
  const data = await fetchFromAlphaVantage({
    function: 'GOLD_SILVER_SPOT',
  })

  if (!data || !data.data) {
    return {
      gold: 2050 + Math.random() * 100,
      silver: 24 + Math.random() * 3,
      timestamp: new Date().toISOString(),
    }
  }

  return data.data
}

// Funciones de ayuda para datos mock
const generateMockNews = () => {
  return [
    {
      title: 'Fed mantiene tasas y sugiere recortes para fin de año',
      summary:
        'La Reserva Federal mantiene las tasas de interés sin cambios y señala posibles recortes hacia finales de año.',
      source: 'Bloomberg',
      publishedAt: new Date().toISOString(),
      sentiment: 0.25,
      sentimentLabel: 'Somewhat-Bullish',
    },
    {
      title: 'Precio del cobre sube por expectativas de demanda china',
      summary: 'El cobre alcanza máximos de 3 meses ante señales de recuperación en China.',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      sentiment: 0.35,
      sentimentLabel: 'Bullish',
    },
    {
      title: 'Tensiones geopolíticas elevan el precio del petróleo',
      summary: 'El crudo WTI supera los $85 por barril por conflictos en Medio Oriente.',
      source: 'WSJ',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      sentiment: -0.15,
      sentimentLabel: 'Somewhat-Bearish',
    },
  ]
}

const generateMockGainersLosers = () => {
  return {
    gainers: [
      { ticker: 'NVDA', price: '950.20', change_amount: '45.30', change_percentage: '5.01%' },
      { ticker: 'TSLA', price: '240.15', change_amount: '10.75', change_percentage: '4.69%' },
      { ticker: 'META', price: '520.60', change_amount: '18.90', change_percentage: '3.77%' },
    ],
    losers: [
      { ticker: 'JNJ', price: '168.90', change_amount: '-5.80', change_percentage: '-3.32%' },
      { ticker: 'WMT', price: '72.85', change_amount: '-2.15', change_percentage: '-2.87%' },
      { ticker: 'PEP', price: '175.30', change_amount: '-4.20', change_percentage: '-2.34%' },
    ],
    mostActive: [
      { ticker: 'AAPL', price: '245.30', volume: '45200000' },
      { ticker: 'MSFT', price: '450.75', volume: '38400000' },
      { ticker: 'NVDA', price: '950.20', volume: '35600000' },
    ],
  }
}

const generateMockEconomicData = (type) => {
  const data = []
  const today = new Date()

  for (let i = 12; i >= 0; i--) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)

    let value
    if (type === 'GDP') {
      value = 22000 + Math.random() * 1000
    } else if (type === 'CPI') {
      value = 300 + Math.random() * 20
    } else {
      value = 4 + Math.random() * 2
    }

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
    })
  }

  return data
}

const generateMockCommodityData = (type) => {
  const data = []
  const today = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    let value
    if (type === 'Oil') {
      value = 75 + Math.random() * 20
    }

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
    })
  }

  return data
}

export default {
  getNewsSentiment,
  getGainersLosers,
  getRealGDP,
  getCPI,
  getTreasuryYield,
  getOilPrice,
  getGoldSilverSpot,
}
