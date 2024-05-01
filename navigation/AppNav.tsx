import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import RegiserPage from '../pages/RegisterPage'
const Stack = createNativeStackNavigator()

const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="RegisterPage" component={RegiserPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default AppNav
