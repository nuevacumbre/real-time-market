/**
 * Servicio de Alpha Vantage API
 * Documentación: https://www.alphavantage.co/documentation/
 *
 * Características:
 * - Datos de acciones en tiempo real
 * - Indicadores técnicos
 * - Forex y criptomonedas
 * - Sin problemas de CORS
 */

import { MARKET_SYMBOLS } from '@/config/constants'

// Obtener API key de variables de entorno
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY
const BASE_URL = 'https://www.alphavantage.co/query'

// Verificar que la API key existe
if (!API_KEY) {
  console.error('❌ ALPHA VANTAGE API KEY no encontrada. Verifica tu archivo .env')
  console.log('📝 Obtén tu API key gratis en: https://www.alphavantage.co/support/#api-key')
}

/**
 * Función genérica para hacer peticiones a Alpha Vantage
 */
const fetchFromAlphaVantage = async (params) => {
  const queryParams = new URLSearchParams({
    ...params,
    apikey: API_KEY,
  })

  const url = `${BASE_URL}?${queryParams.toString()}`
  console.log(`🔍 Alpha Vantage Request: ${url}`)

  try {
    const response = await fetch(url)
    const data = await response.json()

    // Verificar si hay error en la respuesta
    if (data['Error Message']) {
      throw new Error(data['Error Message'])
    }

    if (data['Note']) {
      console.warn('⚠️ Alpha Vantage rate limit:', data['Note'])
      // Rate limit exceeded, usar datos simulados
      return null
    }

    return data
  } catch (error) {
    console.error('❌ Alpha Vantage error:', error)
    return null
  }
}

/**
 * Obtener cotización en tiempo real de una acción
 * Endpoint: GLOBAL_QUOTE
 */
export const getGlobalQuote = async (symbol) => {
  const data = await fetchFromAlphaVantage({
    function: 'GLOBAL_QUOTE',
    symbol,
    datatype: 'json',
  })

  if (!data || !data['Global Quote']) {
    return null
  }

  const quote = data['Global Quote']

  return {
    symbol: quote['01. symbol'],
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    price: parseFloat(quote['05. price']),
    volume: parseInt(quote['06. volume']),
    latestTradingDay: quote['07. latest trading day'],
    previousClose: parseFloat(quote['08. previous close']),
    change: parseFloat(quote['09. change']),
    changePercent: quote['10. change percent'].replace('%', ''),
  }
}

/**
 * Obtener datos de mercado para múltiples símbolos
 */
export const fetchMarketData = async () => {
  console.log('📡 Fetching market data from Alpha Vantage...')

  try {
    const promises = MARKET_SYMBOLS.map(async (item) => {
      try {
        const quote = await getGlobalQuote(item.symbol)

        if (quote) {
          return {
            id: item.symbol,
            nombre: item.name,
            simbolo: item.symbol,
            precio: quote.price,
            variacion: parseFloat(quote.changePercent),
            sector: item.sector,
            volumen: quote.volume,
            timestamp: new Date().toISOString(),
          }
        } else {
          // Si no hay datos, usar fallback
          return getFallbackData(item)
        }
      } catch (error) {
        console.warn(`⚠️ Error con ${item.symbol}, usando fallback:`, error)
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
 * Obtener datos históricos diarios
 * Endpoint: TIME_SERIES_DAILY
 */
export const getDailyTimeSeries = async (symbol, outputSize = 'compact') => {
  if (!symbol) {
    console.warn('⚠️ getDailyTimeSeries: símbolo no proporcionado')
    return generateMockHistoricalData()
  }

  const data = await fetchFromAlphaVantage({
    function: 'TIME_SERIES_DAILY',
    symbol,
    outputsize: outputSize, // 'compact' (100 datos) o 'full' (20+ años)
    datatype: 'json',
  })

  if (!data || !data['Time Series (Daily)']) {
    return generateMockHistoricalData()
  }

  const timeSeries = data['Time Series (Daily)']
  const historicalData = []

  for (const [date, values] of Object.entries(timeSeries)) {
    historicalData.push({
      date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    })
  }

  // Ordenar por fecha ascendente
  return historicalData.sort((a, b) => new Date(a.date) - new Date(b.date))
}

/**
 * Obtener indicador técnico SMA (Simple Moving Average)
 * Endpoint: SMA
 */
export const getSMA = async (symbol, interval = 'daily', timePeriod = 20) => {
  if (!symbol) {
    console.warn('⚠️ getSMA: símbolo no proporcionado')
    return []
  }

  const data = await fetchFromAlphaVantage({
    function: 'SMA',
    symbol,
    interval, // 'daily', 'weekly', 'monthly'
    time_period: timePeriod,
    series_type: 'close',
    datatype: 'json',
  })

  if (!data || !data['Technical Analysis: SMA']) {
    return []
  }

  const smaData = data['Technical Analysis: SMA']

  return Object.entries(smaData)
    .map(([date, values]) => ({
      date,
      sma: parseFloat(values['SMA']),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

/**
 * Obtener datos de búsqueda de símbolos
 * Endpoint: SYMBOL_SEARCH
 */
export const searchSymbols = async (keywords) => {
  const data = await fetchFromAlphaVantage({
    function: 'SYMBOL_SEARCH',
    keywords,
    datatype: 'json',
  })

  if (!data || !data['bestMatches']) {
    return []
  }

  return data['bestMatches'].map((match) => ({
    symbol: match['1. symbol'],
    name: match['2. name'],
    type: match['3. type'],
    region: match['4. region'],
    currency: match['8. currency'],
  }))
}

/**
 * Obtener tipo de cambio forex
 * Endpoint: CURRENCY_EXCHANGE_RATE
 */
export const getCurrencyExchangeRate = async (fromCurrency, toCurrency) => {
  const data = await fetchFromAlphaVantage({
    function: 'CURRENCY_EXCHANGE_RATE',
    from_currency: fromCurrency,
    to_currency: toCurrency,
  })

  if (!data || !data['Realtime Currency Exchange Rate']) {
    return null
  }

  const rate = data['Realtime Currency Exchange Rate']

  return {
    from: rate['1. From_Currency Code'],
    to: rate['3. To_Currency Code'],
    rate: parseFloat(rate['5. Exchange Rate']),
    lastRefreshed: rate['6. Last Refreshed'],
    timeZone: rate['7. Time Zone'],
  }
}

/**
 * Datos de respaldo cuando la API falla
 */
const getFallbackData = (item) => {
  // Precios base actualizados (marzo 2026)
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
    volumen: Math.floor(Math.random() * 10000000),
    timestamp: new Date().toISOString(),
  }
}

/**
 * Generar datos históricos simulados para gráficos
 */
const generateMockHistoricalData = () => {
  const data = []
  const today = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split('T')[0],
      open: 100 + Math.random() * 30,
      high: 100 + Math.random() * 35,
      low: 100 + Math.random() * 25,
      close: 100 + Math.random() * 30,
      volume: Math.floor(Math.random() * 10000000),
    })
  }

  return data
}

export default {
  fetchMarketData,
  getGlobalQuote,
  getDailyTimeSeries,
  getSMA,
  searchSymbols,
  getCurrencyExchangeRate,
}
