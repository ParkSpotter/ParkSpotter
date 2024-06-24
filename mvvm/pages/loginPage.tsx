import React, { useState, useEffect } from 'react'
import { Alert, Text, View, SafeAreaView, Image, Pressable } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet } from 'react-native'
import MySpinner from '../components/Spinner'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'

const logo = require('../../assets/ParkSpotterLogo.png')

const LoginView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [checkingStorage, setCheckingStorage] = useState(true)

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email')
        const savedPassword = await AsyncStorage.getItem('password')
        if (savedEmail && savedPassword) {
          setEmail(savedEmail)
          setPassword(savedPassword)
          await signInWithEmailAndPassword(auth, savedEmail, savedPassword)
          navigation.navigate('Home')
        }
      } catch (error) {
        console.error('Failed to login automatically', error)
        // Continue to show login screen
      } finally {
        setCheckingStorage(false)
      }
    }

    checkUserLoggedIn()
  }, [navigation])

  const saveUserData = async (email: string, password: string) => {
    try {
      await AsyncStorage.setItem('email', email)
      await AsyncStorage.setItem('password', password)
    } catch (error) {
      console.error('Failed to save user data to AsyncStorage', error)
    }
  }

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('email')
      await AsyncStorage.removeItem('password')
    } catch (error) {
      console.error('Failed to clear user data from AsyncStorage', error)
    }
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      await saveUserData(email, password)
      navigation.navigate('Home')
    } catch (error: any) {
      setIsLoading(false)
      Alert.alert('Login Failed', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || checkingStorage) {
    return <MySpinner />
  }

  return (
    <SafeAreaView style={loginStyles.container}>
      <Image source={logo} style={loginStyles.image} resizeMode="contain" />
      <Text style={loginStyles.title}>Login</Text>
      <View style={loginStyles.inputView}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={loginStyles.input}
          left={
            <TextInput.Icon
              icon={() => <Icon name="email" size={20} color="#555" />}
            />
          }
          theme={{
            colors: {
              primary: '#6200ea',
              background: '#fff',
            },
          }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={loginStyles.input}
          left={
            <TextInput.Icon
              icon={() => <Icon name="lock" size={20} color="#555" />}
            />
          }
          theme={{
            colors: {
              primary: '#6200ea',
              background: '#fff',
            },
          }}
        />
      </View>
      <Pressable onPress={() => Alert.alert('Forgot Password!')}>
        <Text style={loginStyles.forgetText}>Forgot Password?</Text>
      </Pressable>
      <View style={loginStyles.buttonView}>
        <Button mode="contained" onPress={onSubmit} style={loginStyles.button}>
          Login
        </Button>
      </View>
      <Text style={loginStyles.footerText}>Don't Have an Account?</Text>
      <View style={loginStyles.buttonView}>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={loginStyles.signup}>Sign Up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  image: {
    height: 160,
    width: 170,
    marginTop: 20,
    borderRadius: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 40,
    color: '#333',
  },
  inputView: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  forgetText: {
    fontSize: 11,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ea',
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 50,
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
    paddingTop: 150,
  },
  signup: {
    color: 'darkblue',
    fontSize: 13,
    alignSelf: 'center',
  },
})

export default LoginView
