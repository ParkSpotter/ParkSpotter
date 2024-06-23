import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyA9Dg6zlEPIv80fQY6ldhWPi64BtWJ5Lic',
  authDomain: 'parkspotter-b0f8d.firebaseapp.com',
  projectId: 'parkspotter-b0f8d',
  storageBucket: 'parkspotter-b0f8d.appspot.com',
  messagingSenderId: '252828691437',
  appId: '1:252828691437:web:a297b09bdaea65921a15e4',
  measurementId: 'G-NTMFBD5S4V',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore(app)

export { auth, db, storage }
