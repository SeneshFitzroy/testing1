/**
 * Firestore Product Seeder
 * Seeds all SHOP_PRODUCTS from constants.js into the 'products' Firestore collection.
 * Each product document includes full image URLs, metadata, and timestamps.
 * 
 * Usage: Import and call seedProductsToFirestore() from any component or console.
 */

import { db } from './firebase'
import { collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { SHOP_PRODUCTS } from './constants'

const PRODUCTS_COLLECTION = 'products'

/**
 * Seeds all shop products to Firestore.
 * Uses setDoc with product.id as document ID for idempotent upserts.
 * @returns {Promise<{success: boolean, count: number, errors: string[]}>}
 */
export async function seedProductsToFirestore() {
  const errors = []
  let count = 0

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION)

    for (const product of SHOP_PRODUCTS) {
      try {
        const docRef = doc(productsRef, product.id)
        await setDoc(docRef, {
          ...product,
          // Ensure all image fields are stored
          image: product.image || '',
          images: product.images || [],
          // Add Firestore metadata
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          searchTerms: [
            product.name.toLowerCase(),
            product.category.toLowerCase(),
            product.material?.toLowerCase() || '',
          ].filter(Boolean),
        }, { merge: true }) // merge: true allows re-running without overwriting user data

        count++
      } catch (err) {
        errors.push(`Failed to seed ${product.id}: ${err.message}`)
        console.error(`[Seed] Error seeding ${product.id}:`, err)
      }
    }

    console.log(`[Seed] Successfully seeded ${count}/${SHOP_PRODUCTS.length} products to Firestore`)
    return { success: errors.length === 0, count, errors }
  } catch (err) {
    console.error('[Seed] Fatal error:', err)
    return { success: false, count, errors: [...errors, err.message] }
  }
}

/**
 * Fetches all products from the Firestore 'products' collection.
 * @returns {Promise<Array>} Array of product objects
 */
export async function getProductsFromFirestore() {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    const snapshot = await getDocs(productsRef)
    
    const products = []
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() })
    })

    console.log(`[Firestore] Fetched ${products.length} products`)
    return products
  } catch (err) {
    console.error('[Firestore] Error fetching products:', err)
    return []
  }
}

/**
 * Checks if products are already seeded in Firestore.
 * @returns {Promise<boolean>}
 */
export async function isProductsSeeded() {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    const snapshot = await getDocs(productsRef)
    return snapshot.size >= SHOP_PRODUCTS.length
  } catch {
    return false
  }
}
