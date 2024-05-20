import React, { FC, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const Register: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      Alert.alert('Registration Successful', 'You can now login', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ])
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
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
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.textButton}
      >
        Go to Login
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ea',
  },
  textButton: {
    marginVertical: 10,
  },
})

export default Register
