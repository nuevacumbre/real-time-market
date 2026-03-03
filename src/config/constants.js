// Market symbols configuration - Ampliado para Alpha Vantage
export const MARKET_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Tecnología' },
  { symbol: 'MSFT', name: 'Microsoft', sector: 'Tecnología' },
  { symbol: 'GOOGL', name: 'Google', sector: 'Tecnología' },
  { symbol: 'AMZN', name: 'Amazon', sector: 'Consumo' },
  { symbol: 'TSLA', name: 'Tesla', sector: 'Automotriz' },
  { symbol: 'META', name: 'Meta', sector: 'Tecnología' },
  { symbol: 'NVDA', name: 'NVIDIA', sector: 'Tecnología' },
  { symbol: 'JPM', name: 'JPMorgan', sector: 'Financiero' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Salud' },
  { symbol: 'WMT', name: 'Walmart', sector: 'Consumo' },
  // Nuevos símbolos
  { symbol: 'NFLX', name: 'Netflix', sector: 'Consumo' },
  { symbol: 'DIS', name: 'Disney', sector: 'Consumo' },
  { symbol: 'V', name: 'Visa', sector: 'Financiero' },
  { symbol: 'MA', name: 'Mastercard', sector: 'Financiero' },
  { symbol: 'PEP', name: 'PepsiCo', sector: 'Consumo' },
]

// Crypto symbols for forex endpoint
export const CRYPTO_SYMBOLS = [
  { symbol: 'BTC', name: 'Bitcoin', currency: 'USD' },
  { symbol: 'ETH', name: 'Ethereum', currency: 'USD' },
  { symbol: 'BNB', name: 'Binance Coin', currency: 'USD' },
  { symbol: 'SOL', name: 'Solana', currency: 'USD' },
  { symbol: 'ADA', name: 'Cardano', currency: 'USD' },
  { symbol: 'DOT', name: 'Polkadot', currency: 'USD' },
]

// News categories
export const NEWS_CATEGORIES = ['Mercados', 'Tecnología', 'Economía', 'Política', 'Empresas']

// Alpha Vantage configuration
export const ALPHA_VANTAGE_CONFIG = {
  baseUrl: 'https://www.alphavantage.co/query',
  rateLimit: 5, // requests per minute
  dailyLimit: 500,
}

// Local storage keys
export const STORAGE_KEYS = {
  RECENTLY_VIEWED: 'recently_viewed',
  USER_PREFERENCES: 'user_preferences',
  PORTFOLIO: 'portfolio',
}

// App configuration
export const APP_CONFIG = {
  name: 'Real-Time Market',
  version: '1.0.0',
  refreshInterval: 60000, // 1 minute
  maxRecentlyViewed: 10,
}
