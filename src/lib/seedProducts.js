/**
 * Firestore Product Seeder
 * Seeds all SHOP_PRODUCTS from constants.js into the 'products' Firestore collection.
 * Each product document includes full image URLs, metadata, and timestamps.
 * 
 * Usage: Import and call seedProductsToFirestore() from any component or console.
 */

import { db } from './firebase'
import { collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { SHOP_PRODUCTS, PRODUCTS_TO_EXCLUDE } from './constants'

const PRODUCTS_COLLECTION = 'products'

/** Remove excluded products from Firestore (Arc Floor Lamp, Round Wall Mirror, Globe Pendant Light) */
async function removeExcludedProductsFromFirestore() {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION))
    let removed = 0
    for (const d of snapshot.docs) {
      const name = d.data()?.name || ''
      if (PRODUCTS_TO_EXCLUDE.includes(name)) {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, d.id))
        removed++
      }
    }
    if (removed > 0) console.log(`[Seed] Removed ${removed} excluded product(s) from Firestore`)
  } catch (err) {
    console.warn('[Seed] Cleanup excluded products failed:', err)
  }
}

/** Save a single product to Firestore (add or update) */
export async function saveProductToFirestore(product) {
  if (!product?.id) return false
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id)
    const { createdAt, updatedAt, ...rest } = product
    await setDoc(docRef, {
      ...rest,
      image: product.image || '',
      images: product.images || [],
      updatedAt: serverTimestamp(),
    }, { merge: true })
    return true
  } catch (err) {
    console.error('[Firestore] Save product failed:', err)
    return false
  }
}

/** Delete a product from Firestore */
export async function deleteProductFromFirestore(productId) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId))
    return true
  } catch (err) {
    console.error('[Firestore] Delete product failed:', err)
    return false
  }
}

/**
 * Seeds all shop products to Firestore.
 * Uses setDoc with product.id as document ID for idempotent upserts.
 * @returns {Promise<{success: boolean, count: number, errors: string[]}>}
 */
export async function seedProductsToFirestore() {
  const errors = []
  let count = 0

  try {
    await removeExcludedProductsFromFirestore()
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
