import { create } from 'zustand'
import { auth, db } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Professional, user-friendly error messages for Firebase Auth codes
const getAuthErrorMessage = (error) => {
  const code = error?.code || ''
  const errorMessages = {
    // Login errors
    'auth/invalid-credential': 'The email or password you entered is incorrect. Please double-check and try again.',
    'auth/user-not-found': 'We couldn\'t find an account with that email address. Would you like to create one?',
    'auth/wrong-password': 'The password you entered is incorrect. Please try again or reset your password.',
    'auth/invalid-email': 'Please enter a valid email address (e.g., name@example.com).',
    'auth/user-disabled': 'This account has been temporarily disabled. Please contact our support team for assistance.',
    'auth/too-many-requests': 'Too many unsuccessful attempts. For your security, please wait a few minutes before trying again.',
    
    // Registration errors
    'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead, or use a different email.',
    'auth/weak-password': 'Your password is too weak. Please use at least 6 characters with a mix of letters, numbers, and symbols.',
    'auth/operation-not-allowed': 'This sign-in method is currently unavailable. Please try another method or contact support.',
    
    // Google sign-in errors
    'auth/popup-closed-by-user': 'The sign-in window was closed before completing. Please try again when you\'re ready.',
    'auth/popup-blocked': 'Your browser blocked the sign-in popup. Try the "Continue with Google" button again, or use email/password.',
    'auth/cancelled-popup-request': 'A sign-in attempt is already in progress. Please wait for it to complete.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method. Try signing in with your original method.',
    'auth/unauthorized-domain': 'This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains (e.g. lee-roo-wood-designs.vercel.app).',
    'auth/operation-not-allowed': 'Google sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method → Google.',
    
    // Network & general errors
    'auth/network-request-failed': 'We couldn’t reach our servers. Please check your connection and try again.',
    'auth/internal-error': 'Something went wrong on our end. Please try again in a moment.',
    'auth/timeout': 'The request timed out. Please check your connection and try again.',
    'auth/quota-exceeded': 'Service is temporarily busy. Please try again in a few minutes.',
    'auth/requires-recent-login': 'For security purposes, please sign in again to complete this action.',
    // API / project config
    'auth/configuration-not-found': 'Authentication is not configured correctly. Please contact support.',
    'auth/api-key-not-valid': 'Service configuration error. Please try again later.',
    'auth/invalid-api-key': 'Service configuration error. Please try again later.',
    'auth/app-deleted': 'This app has been deleted. Please contact support.',
    'auth/app-not-authorized': 'This app is not authorized. Please contact support.',
    'auth/captcha-check-failed': 'Security check failed. Please try again.',
    'auth/tenant-id-mismatch': 'Authentication error. Please try again.',
    'auth/invalid-oauth-provider': 'Sign-in provider error. Please try again.',
    'auth/redirect-uri-mismatch': 'Redirect configuration error. Please try again.',
    'auth/provider-already-linked': 'This account is already linked. Try signing in with your original method.',
    'auth/credential-already-in-use': 'This credential is already used by another account.',
    'auth/user-mismatch': 'Account mismatch. Please sign in with the correct account.',
  }
  const msg = errorMessages[code] || error?.message || 'Something unexpected happened. Please try again or contact support if the issue persists.'
  return msg
}

const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,

  // Initialize auth listener + handle Google redirect result (mobile sign-in)
  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userProfile = null
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid))
          if (docSnap.exists()) {
            userProfile = docSnap.data()
          }
        } catch (e) {
          console.warn('Could not fetch user profile:', e)
        }
        set({ user, userProfile, loading: false })
      } else {
        set({ user: null, userProfile: null, loading: false })
      }
    })

    // Handle Google redirect return (must run on every page load)
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user) return
        try {
          const docSnap = await getDoc(doc(db, 'users', result.user.uid))
          if (!docSnap.exists()) {
            const userProfile = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              role: 'user',
              createdAt: new Date().toISOString(),
              designs: [],
              wishlist: [],
            }
            await setDoc(doc(db, 'users', result.user.uid), userProfile)
          }
          const updated = await getDoc(doc(db, 'users', result.user.uid))
          set((s) => ({ ...s, userProfile: updated.exists() ? updated.data() : s.userProfile }))
        } catch (e) {
          console.warn('Could not create/update profile after redirect:', e)
        }
      })
      .catch((err) => {
        const friendlyMessage = getAuthErrorMessage(err)
        set({ error: friendlyMessage, loading: false })
      })
  },

  // Email & password login
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const docSnap = await getDoc(doc(db, 'users', result.user.uid))
      const userProfile = docSnap.exists() ? docSnap.data() : null
      set({ user: result.user, userProfile, loading: false })
      return result.user
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error)
      set({ error: friendlyMessage, loading: false })
      throw { ...error, friendlyMessage }
    }
  },

  // Register new user
  register: async (email, password, displayName) => {
    set({ loading: true, error: null })
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      const userProfile = {
        uid: result.user.uid,
        email,
        displayName,
        role: 'user',
        createdAt: new Date().toISOString(),
        designs: [],
        wishlist: [],
      }
      await setDoc(doc(db, 'users', result.user.uid), userProfile)
      set({ user: result.user, userProfile, loading: false })
      return result.user
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error)
      set({ error: friendlyMessage, loading: false })
      throw { ...error, friendlyMessage }
    }
  },

  // Google sign-in: always use redirect (avoids COOP popup issues & works on all devices)
  loginWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
      return null // Page will redirect; getRedirectResult handles return
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error)
      set({ error: friendlyMessage, loading: false })
      throw { ...error, friendlyMessage }
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null, userProfile: null })
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error)
      set({ error: friendlyMessage })
    }
  },

  clearError: () => set({ error: null }),
  isAdmin: () => get().userProfile?.role === 'admin',
  isDesigner: () => get().userProfile?.role === 'designer' || get().userProfile?.role === 'admin',
  isDesignerOnly: () => get().userProfile?.role === 'designer',

  // Refresh profile from Firestore (e.g. after Settings save)
  refreshProfile: async () => {
    const user = get().user
    if (!user?.uid) return
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid))
      const userProfile = docSnap.exists() ? docSnap.data() : null
      set({ userProfile })
    } catch (e) {
      console.warn('Could not refresh profile:', e)
    }
  },
}))

export default useAuthStore
