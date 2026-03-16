import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase config — MUST use key from Firebase Console (project 562570699070).
// Do NOT use a key from another GCP project — Identity Toolkit must be enabled.
const firebaseConfig = {
  apiKey: "AIzaSyC5j3JXEmO5kKevTsN9t88NPrNq-S-tqaM",
  authDomain: "pusl3122-group-01.firebaseapp.com",
  projectId: "pusl3122-group-01",
  storageBucket: "pusl3122-group-01.firebasestorage.app",
  messagingSenderId: "562570699070",
  appId: "1:562570699070:web:325630c0083f1279eccc6f",
  measurementId: "G-WCDP418QMK"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
