/**
 * Auto-provision default admin & demo user accounts in Firebase.
 * Called once on app boot; skips silently if the accounts already exist.
 */
import { auth, db } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const DEFAULT_ACCOUNTS = [
  {
    email: 'admin@leeroo.com',
    password: 'Admin@123',
    displayName: 'Lee Roo Admin',
    role: 'admin',
  },
  {
    email: 'designer@leeroo.com',
    password: 'Designer@123',
    displayName: 'Lee Roo Designer',
    role: 'designer',
  },
  {
    email: 'user@leeroo.com',
    password: 'User@123',
    displayName: 'Demo User',
    role: 'user',
  },
]

/**
 * Ensure both default accounts exist in Firebase Auth + Firestore.
 * - If the account doesn't exist → register it + write user doc.
 * - If the account exists but the Firestore doc is missing / wrong role → fix it.
 * - Always signs back out when done so current session isn't tainted.
 */
export async function ensureDefaultAccounts() {
  // Remember the current user so we can restore context afterwards
  const previousUser = auth.currentUser

  for (const acct of DEFAULT_ACCOUNTS) {
    try {
      // Try creating the account (will throw if already exists)
      let credential
      try {
        credential = await createUserWithEmailAndPassword(auth, acct.email, acct.password)
        await updateProfile(credential.user, { displayName: acct.displayName })
        console.log(`[Setup] Created account: ${acct.email} (${acct.role})`)
      } catch (e) {
        if (e.code === 'auth/email-already-in-use') {
          // Account exists — sign in to get uid
          credential = await signInWithEmailAndPassword(auth, acct.email, acct.password)
        } else {
          throw e
        }
      }

      const uid = credential.user.uid

      // --- Ensure Firestore user document has the correct role ---
      const userDocRef = doc(db, 'users', uid)
      const snap = await getDoc(userDocRef)

      if (!snap.exists() || snap.data()?.role !== acct.role) {
        await setDoc(
          userDocRef,
          {
            uid,
            email: acct.email,
            displayName: acct.displayName,
            name: acct.displayName,
            role: acct.role,
            createdAt: snap.exists() ? snap.data().createdAt : new Date().toISOString(),
            designs: [],
            wishlist: [],
          },
          { merge: true }
        )
        console.log(`[Setup] Wrote Firestore profile for ${acct.email} → role: ${acct.role}`)
      }

      // Sign out this temporary session
      await signOut(auth)
    } catch (err) {
      // Non-fatal — just log and continue
      console.warn(`[Setup] Could not provision ${acct.email}:`, err.message || err)
      try { await signOut(auth) } catch (_) { /* ignore */ }
    }
  }
}
