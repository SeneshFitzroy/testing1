import { create } from 'zustand'
import { auth, db } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
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
    'auth/popup-blocked': 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.',
    'auth/cancelled-popup-request': 'A sign-in attempt is already in progress. Please wait for it to complete.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method. Try signing in with your original method.',
    
    // Network & general errors
    'auth/network-request-failed': 'We couldn’t reach our servers. Please check your connection and try again.',
    'auth/internal-error': 'Something went wrong on our end. Please try again in a moment.',
    'auth/timeout': 'The request timed out. Please check your connection and try again.',
    'auth/quota-exceeded': 'Service is temporarily busy. Please try again in a few minutes.',
    'auth/requires-recent-login': 'For security purposes, please sign in again to complete this action.',
  }
  return errorMessages[code] || 'Something unexpected happened. Please try again or contact support if the issue persists.'
}

const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,

  // Initialize auth listener
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

  // Google sign-in
  loginWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const docSnap = await getDoc(doc(db, 'users', result.user.uid))
      let userProfile
      if (!docSnap.exists()) {
        userProfile = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'user',
          createdAt: new Date().toISOString(),
          designs: [],
          wishlist: [],
        }
        await setDoc(doc(db, 'users', result.user.uid), userProfile)
      } else {
        userProfile = docSnap.data()
      }
      set({ user: result.user, userProfile, loading: false })
      return result.user
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error)
      // Don't show error for popup closed by user - not really an error
      if (error?.code === 'auth/popup-closed-by-user') {
        set({ error: null, loading: false })
        return null
      }
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
