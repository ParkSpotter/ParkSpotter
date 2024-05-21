import React, { FC, useContext, useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { User, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { Context } from '../context/context'

const logo = require('../assets/ParkSpotterLogo.png')

const LoginPage: FC<{ route: any; navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('test@gmail.com')
  const [password, setPassword] = useState('123456')
  const { user, setUser } = useContext(Context)
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      )

      const user: User = userCredential.user
      Alert.alert('Login Successful', `Welcome back, ${user.email}!`)
      navigation.navigate('Home')
      setPassword('')
      setUsername('')
    } catch (error: any) {
      Alert.alert('Login Failed', error.message)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <TextInput
          label="Email"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          left={
            <TextInput.Icon
              icon={() => <Icon name="email" size={20} color="#555" />}
            />
          }
          theme={{
            colors: {
              // placeholder: '#555',
              // text: 'black',
              primary: '#6200ea',
              // underlineColor: 'transparent',
              background: '#fff',
            },
          }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          left={
            <TextInput.Icon
              icon={() => <Icon name="lock" size={20} color="#555" />}
            />
          }
          theme={{
            colors: {
              // placeholder: '#555',
              // text: 'black',
              primary: '#6200ea',
              // underlineColor: 'transparent',
              background: '#fff',
            },
          }}
        />
      </View>
      <Pressable onPress={() => Alert.alert('Forgot Password!')}>
        <Text style={styles.forgetText}>Forgot Password?</Text>
      </Pressable>
      <View style={styles.buttonView}>
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
      </View>
      <Text style={styles.footerText}>Don't Have an Account?</Text>
      <View style={styles.buttonView}>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signup}>Sign Up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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

export default LoginPage
