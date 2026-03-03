import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
  where,
} from 'firebase/firestore'
import { NEWS_CATEGORIES } from '@/config/constants'

// Collection reference
const newsCollection = collection(db, 'news')

/**
 * Get all news ordered by date (newest first)
 */
export const fetchNews = async (category = null, maxItems = 20) => {
  try {
    let q

    if (category && NEWS_CATEGORIES.includes(category)) {
      q = query(
        newsCollection,
        where('category', '==', category),
        orderBy('publishedAt', 'desc'),
        limit(maxItems),
      )
    } else {
      q = query(newsCollection, orderBy('publishedAt', 'desc'), limit(maxItems))
    }

    const snapshot = await getDocs(q)
    const news = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log('📰 Noticias obtenidas de Firebase:', news.length)
    return news
  } catch (error) {
    console.error('Error fetching news:', error)
    // Datos de ejemplo para desarrollo
    return getMockNews()
  }
}

/**
 * Get single news by ID
 */
export const fetchNewsById = async (id) => {
  try {
    const docRef = doc(db, 'news', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return getMockNews().find((n) => n.id === id) || null
    }
  } catch (error) {
    console.error('Error fetching news detail:', error)
    return getMockNews().find((n) => n.id === id) || null
  }
}

/**
 * Datos de ejemplo para desarrollo
 */
const getMockNews = () => {
  return [
    {
      id: '1',
      title: 'Apple alcanza nuevo récord histórico',
      summary: 'Las acciones de Apple suben 5% después de anunciar nuevos productos.',
      content:
        '<p>Apple Inc. (AAPL) alcanzó un nuevo máximo histórico hoy, superando las expectativas del mercado. La compañía anunció su nuevo iPhone y servicios de inteligencia artificial.</p><p>Los analistas predicen un crecimiento continuo en el próximo trimestre.</p>',
      category: 'Tecnología',
      imageUrl: 'https://via.placeholder.com/800x400',
      author: 'Christopher Espinoza',
      publishedAt: new Date().toISOString(),
      views: 1234,
    },
    {
      id: '2',
      title: 'Fed mantiene tasas de interés sin cambios',
      summary: 'La Reserva Federal decide mantener las tasas en su nivel actual.',
      content:
        '<p>La Reserva Federal anunció hoy que mantendrá las tasas de interés sin cambios, en línea con las expectativas del mercado.</p><p>El presidente de la Fed señaló que monitorearán de cerca la inflación.</p>',
      category: 'Economía',
      imageUrl: 'https://via.placeholder.com/800x400',
      author: 'Christopher Espinoza',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      views: 856,
    },
    {
      id: '3',
      title: 'Tesla anuncia nueva fábrica en México',
      summary: 'La compañía de Elon Musk invertirá $5 mil millones en su nueva planta.',
      content:
        '<p>Tesla confirmó hoy la construcción de una nueva gigafactory en México, creando miles de empleos.</p><p>La acción subió 3% en after-hours.</p>',
      category: 'Empresas',
      imageUrl: 'https://via.placeholder.com/800x400',
      author: 'Christopher Espinoza',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      views: 2341,
    },
  ]
}

/**
 * Create a new news post (admin only in real app)
 */
export const createNews = async (newsData) => {
  try {
    const docRef = await addDoc(newsCollection, {
      ...newsData,
      publishedAt: new Date().toISOString(),
      views: 0,
    })
    return { id: docRef.id, success: true }
  } catch (error) {
    console.error('Error creating news:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Add a comment to a news post
 */
export const addComment = async (newsId, commentData) => {
  try {
    const commentsCollection = collection(db, 'news', newsId, 'comments')
    const docRef = await addDoc(commentsCollection, {
      ...commentData,
      createdAt: new Date().toISOString(),
    })
    return { id: docRef.id, success: true }
  } catch (error) {
    console.error('Error adding comment:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get comments for a news post
 */
export const fetchComments = async (newsId) => {
  try {
    const commentsCollection = collection(db, 'news', newsId, 'comments')
    const q = query(commentsCollection, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}
