import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomePage from '../pages/HomePage'
import CarsPage from '../pages/CarsPage'
import GroupsPage from '../pages/GroupsPage'
import LoginView from '../mvvm/Login/loginView'
import RegisterView from '../mvvm/Register/registerView'
const Stack = createNativeStackNavigator()

const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cars"
          component={CarsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Groups"
          component={GroupsPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default AppNav
