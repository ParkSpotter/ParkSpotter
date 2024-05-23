import { useState } from 'react'
import { LoginViewModel } from './loginModel'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { Alert } from 'react-native'

const useLoginViewModel = (
  navigate: (route: string) => void
): LoginViewModel => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      setIsLoading(false)
      navigate('Home')
    } catch (error: any) {
      Alert.alert('Login Failed', error.message)
    }
  }
  return {
    email,
    setEmail,
    password,
    setPassword,
    onSubmit,
    isLoading,
    setIsLoading,
  }
}

export default useLoginViewModel
