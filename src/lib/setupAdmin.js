/**
 * Demo account provisioning.
 *
 * SECURITY: Never commit passwords or credentials to git.
 * Demo accounts (admin, designer, user) must be created manually in:
 *   Firebase Console → Authentication → Users → Add user
 * Then add a Firestore document: users/{uid} with { role: 'admin' | 'designer' | 'user' }
 *
 * For automatic provisioning during local dev, use .env.local (gitignored) with:
 *   VITE_DEMO_PROVISION=1
 *   VITE_DEMO_ADMIN_EMAIL=admin@leeroo.com
 *   VITE_DEMO_ADMIN_PASSWORD=your-secret-password
 *   (and optional VITE_DEMO_DESIGNER_*, VITE_DEMO_USER_*)
 */
export async function ensureDefaultAccounts() {
  const env = typeof import.meta !== 'undefined' ? import.meta.env : {}
  if (env.VITE_DEMO_PROVISION !== '1' || !env.VITE_DEMO_ADMIN_PASSWORD) {
    return
  }
  const { auth, db } = await import('./firebase')
  const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } = await import('firebase/auth')
  const { doc, getDoc, setDoc } = await import('firebase/firestore')

  const accounts = [
    { email: env.VITE_DEMO_ADMIN_EMAIL || 'admin@leeroo.com', password: env.VITE_DEMO_ADMIN_PASSWORD, displayName: 'Admin', role: 'admin' },
    { email: env.VITE_DEMO_DESIGNER_EMAIL || 'designer@leeroo.com', password: env.VITE_DEMO_DESIGNER_PASSWORD || env.VITE_DEMO_ADMIN_PASSWORD, displayName: 'Designer', role: 'designer' },
    { email: env.VITE_DEMO_USER_EMAIL || 'user@leeroo.com', password: env.VITE_DEMO_USER_PASSWORD || env.VITE_DEMO_ADMIN_PASSWORD, displayName: 'Demo User', role: 'user' },
  ]

  for (const acct of accounts) {
    if (!acct.password) continue
    try {
      let credential
      try {
        credential = await createUserWithEmailAndPassword(auth, acct.email, acct.password)
        await updateProfile(credential.user, { displayName: acct.displayName })
      } catch (e) {
        if (e?.code === 'auth/email-already-in-use') {
          credential = await signInWithEmailAndPassword(auth, acct.email, acct.password)
        } else throw e
      }
      const userRef = doc(db, 'users', credential.user.uid)
      const snap = await getDoc(userRef)
      if (!snap.exists() || snap.data()?.role !== acct.role) {
        await setDoc(userRef, {
          uid: credential.user.uid,
          email: acct.email,
          displayName: acct.displayName,
          name: acct.displayName,
          role: acct.role,
          createdAt: snap.exists() ? snap.data().createdAt : new Date().toISOString(),
          designs: [],
          wishlist: [],
        }, { merge: true })
      }
      await signOut(auth)
    } catch (err) {
      console.warn('[Setup]', acct.email, err?.message || err)
      try { await signOut(auth) } catch (_) {}
    }
  }
}
