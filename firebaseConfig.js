import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC0CI3ZgiQ8vMmLnuZvKf9QAA_v5qQPe5o',
  authDomain: 'parkspotter-368c8.firebaseapp.com',
  projectId: 'parkspotter-368c8',
  storageBucket: 'parkspotter-368c8.appspot.com',
  messagingSenderId: '155180757937',
  appId: '1:155180757937:web:bc269d2ca4092aca0e0390',
  measurementId: 'G-9N5H020JX7',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const firestore = getFirestore(app)

export { auth, firestore }
