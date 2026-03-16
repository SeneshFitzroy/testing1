import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVAscjbk9s7dYi4UaTM2Ir2T7hCqMntz4",
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
