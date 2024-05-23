import React from 'react'
import { Alert, Text, View, SafeAreaView, Image, Pressable } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useLoginViewModel from './loginViewModel'
import { loginStyles } from './loginStyles'
import MySpinner from '../components/Spinner'
const logo = require('../../assets/ParkSpotterLogo.png')

const LoginView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { email, password, setEmail, setPassword, onSubmit, isLoading } =
    useLoginViewModel((route: string) => navigation.navigate(route))
  if (isLoading) {
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

export default LoginView
