import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../pages/homePage';
import LoginView from '../pages/loginPage';
import RegisterView from '../pages/registerPage';
import editProfile from '../pages/editProfile';
const Stack = createNativeStackNavigator();

const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name='Home'
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Login'
          component={LoginView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='MyAccount'
          component={editProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Register'
          component={RegisterView}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNav;
