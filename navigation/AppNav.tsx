import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import RegisterPage from '../pages/RegiserPage' // Corrected the typo in the file path

const Stack = createNativeStackNavigator()

const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterPage"
          component={RegisterPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default AppNav
