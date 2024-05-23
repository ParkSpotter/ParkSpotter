import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '../../firebaseConfig'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Alert } from 'react-native'
import { RegisterViewModel } from './registerModel'

const useRegisterViewModel = (
  navigate: (route: string) => void
): RegisterViewModel => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await addDoc(collection(db, 'users'), {
        id: userCredential.user.uid,
        email,
        username,
        password,
        groups: [],
        cars: [],
      })
      setIsLoading(false)
      navigate('Login')
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message)
    }
  }
  return {
    email,
    username,
    setUserName,
    setEmail,
    password,
    setPassword,
    onSubmit,
    isLoading,
    setIsLoading,
    image,
    setImage,
  }
}

export default useRegisterViewModel
