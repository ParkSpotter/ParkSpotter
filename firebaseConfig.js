import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// import { Database, getDatatbase, ref } from 'firebase/database'
const firebaseConfig = {

  apiKey: "AIzaSyAmpH7G_RlXUfIY_HeKWUVlYHc77tapCdg",
  authDomain: "parkspotter-21dc6.firebaseapp.com",
  projectId: "parkspotter-21dc6",
  storageBucket: "parkspotter-21dc6.appspot.com",
  messagingSenderId: "673932586387",
  appId: "1:673932586387:web:9b48b46a800b43de880c66",
  measurementId: "G-ZMP007WH4Q"
};


const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
