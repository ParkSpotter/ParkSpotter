import React from 'react'
import { Text, View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import useRegisterViewModel from './registerViewModel'
import { styles } from './registerStyles'
import MySpinner from '../components/Spinner'

const RegisterView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    onSubmit,
    username,
    setUserName,
    isLoading,
  } = useRegisterViewModel((route: string) => navigation.navigate(route))

  if (isLoading) {
    return <MySpinner />
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
            primary: '#6200ea',
            background: '#fff',
          },
        }}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUserName}
        style={styles.input}
        left={
          <TextInput.Icon
            icon={() => <Icon name="account" size={20} color="#555" />}
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
        style={styles.input}
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
      <Button mode="contained" onPress={onSubmit} style={styles.button}>
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

export default RegisterView
