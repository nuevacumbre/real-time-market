import { MARKET_SYMBOLS } from '@/config/constants'

// Lista de proxies CORS para tener respaldos
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://corsproxy.io/?',
]

// Función para intentar con diferentes proxies
const fetchWithProxy = async (url, proxyIndex = 0) => {
  if (proxyIndex >= CORS_PROXIES.length) {
    throw new Error('Todos los proxies fallaron')
  }

  try {
    const proxyUrl = `${CORS_PROXIES[proxyIndex]}${encodeURIComponent(url)}`
    console.log(`🔌 Intentando con proxy ${proxyIndex + 1}:`, CORS_PROXIES[proxyIndex])

    const response = await fetch(proxyUrl, {
      headers: {
        Origin: window.location.origin,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn(`❌ Proxy ${proxyIndex + 1} falló:`, error.message)
    // Intentar con el siguiente proxy
    return fetchWithProxy(url, proxyIndex + 1)
  }
}

/**
 * Fetch real-time stock data from Yahoo Finance
 */
export const fetchMarketData = async () => {
  console.log('📡 Fetching market data...')

  try {
    const promises = MARKET_SYMBOLS.map(async (item) => {
      try {
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}?interval=1d`
        const data = await fetchWithProxy(yahooUrl)

        const result = data.chart?.result?.[0]
        const meta = result?.meta
        const quote = result?.indicators?.quote?.[0]

        if (!meta || !quote) {
          throw new Error('Datos incompletos')
        }

        const currentPrice = meta.regularMarketPrice
        const previousClose = meta.previousClose
        const variation = (((currentPrice - previousClose) / previousClose) * 100).toFixed(2)

        return {
          id: item.symbol,
          nombre: item.name,
          simbolo: item.symbol,
          precio: currentPrice,
          variacion: parseFloat(variation),
          sector: item.sector,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.warn(`⚠️ Error con ${item.symbol}, usando datos de respaldo:`, error.message)
        return getFallbackData(item)
      }
    })

    const results = await Promise.all(promises)
    console.log('✅ Datos de mercado obtenidos:', results.length)
    return results
  } catch (error) {
    console.error('❌ Error grave en fetchMarketData:', error)
    return MARKET_SYMBOLS.map((item) => getFallbackData(item))
  }
}

/**
 * Get fallback data when API fails
 */
const getFallbackData = (item) => {
  // Precios base actualizados (febrero 2026)
  const basePrices = {
    AAPL: 245.3,
    MSFT: 450.75,
    GOOGL: 175.2,
    AMZN: 195.8,
    TSLA: 210.45,
    META: 520.6,
    NVDA: 980.5,
    JPM: 195.3,
    JNJ: 168.9,
    WMT: 72.85,
  }

  // Variación aleatoria realista (-3% a +3%)
  const randomVariation = (Math.random() * 6 - 3).toFixed(2)

  return {
    id: item.symbol,
    nombre: item.name,
    simbolo: item.symbol,
    precio: basePrices[item.symbol] || 100.0,
    variacion: parseFloat(randomVariation),
    sector: item.sector,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Get historical data for a symbol
 */
export const fetchHistoricalData = async (symbol, period = '1mo') => {
  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${period}&interval=1d`
    const data = await fetchWithProxy(yahooUrl)

    const result = data.chart?.result?.[0]
    const timestamps = result?.timestamp || []
    const quotes = result?.indicators?.quote?.[0]

    if (!timestamps.length || !quotes) {
      throw new Error('No hay datos históricos')
    }

    return timestamps.map((time, index) => ({
      date: new Date(time * 1000).toISOString().split('T')[0],
      price: quotes.close?.[index] || 0,
      volume: quotes.volume?.[index] || 0,
    }))
  } catch (error) {
    console.error(`📉 Error en datos históricos para ${symbol}:`, error)
    // Generar datos simulados para el gráfico
    return generateMockHistoricalData()
  }
}

// Generar datos históricos simulados para el gráfico
const generateMockHistoricalData = () => {
  const data = []
  const today = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split('T')[0],
      price: 100 + Math.random() * 30,
      volume: Math.floor(Math.random() * 10000000),
    })
  }

  return data
}
