import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// import { Database, getDatatbase, ref } from 'firebase/database'
const firebaseConfig = {
  apiKey: 'AIzaSyC0CI3ZgiQ8vMmLnuZvKf9QAA_v5qQPe5o',
  authDomain: 'parkspotter-368c8.firebaseapp.com',
  // databaseURL: 'https://parkspotter-368c8-default-rtdb.firebaseio.com',
  projectId: 'parkspotter-368c8',
  storageBucket: 'parkspotter-368c8.appspot.com',
  messagingSenderId: '155180757937',
  appId: '1:155180757937:web:bc269d2ca4092aca0e0390',
  measurementId: 'G-9N5H020JX7',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const firestore = getFirestore(app)

// function createUser(email, passowrd) {

//   const reference = ref(db, 'users/' + email)
//   const db = getDatatbase

//   set(reference, {
//     email: email,
//     password: passowrd
//   })
// }
// createUser("new@gmail.com","123456")
export { auth, firestore }
