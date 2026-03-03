import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

// 🔍 DEBUG: Ver qué variables de entorno se están cargando
console.log('🔍 Variables de entorno:')
console.log(
  '- VITE_FIREBASE_API_KEY:',
  import.meta.env.VITE_FIREBASE_API_KEY ? '✓ DEFINIDA' : '✗ NO DEFINIDA',
)
console.log(
  '- VITE_FIREBASE_AUTH_DOMAIN:',
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓ DEFINIDA' : '✗ NO DEFINIDA',
)
console.log(
  '- VITE_FIREBASE_PROJECT_ID:',
  import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓ DEFINIDA' : '✗ NO DEFINIDA',
)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Validar que las variables necesarias existen
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
]

let missingVars = []
requiredVars.forEach((varName) => {
  if (!import.meta.env[varName]) {
    console.error(`❌ Variable de entorno faltante: ${varName}`)
    missingVars.push(varName)
  }
})

if (missingVars.length > 0) {
  console.error('❌ Firebase no se inicializará correctamente. Verifica tu archivo .env')
  console.log('📝 Crea un archivo .env basado en .env.example con tus credenciales de Firebase')
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const auth = getAuth(app)
export const db = getFirestore(app)

// Inicializar Analytics condicionalmente (solo si está soportado y en producción)
export const analytics = await isSupported()
  .then((yes) => (yes ? getAnalytics(app) : null))
  .catch(() => null)

console.log('✅ Firebase inicializado correctamente')

export default app
