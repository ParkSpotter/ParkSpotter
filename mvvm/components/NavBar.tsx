import React, { FC } from 'react'
import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const NavBar: FC<{ route: any; navigation: any; title: string }> = ({
  route,
  navigation,
  title,
}) => {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('email')
            await AsyncStorage.removeItem('password')
            navigation.navigate('Login')
          } catch (error) {
            console.error('Failed to clear user data from AsyncStorage', error)
          }
        },
      },
    ])
  }

  return (
    <Appbar.Header style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={28} color="#ffffff" style={styles.HomeIcon} />
      </TouchableOpacity>
      <Appbar.Content title={title} titleStyle={styles.title} />
      <TouchableOpacity onPress={() => navigation.navigate('MyAccount')}>
        <Icon name="account" size={28} color="#ffffff" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Icon name="logout" size={28} color="#ffffff" style={styles.icon} />
      </TouchableOpacity>
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6200ee',
    height: 56,
    elevation: 4,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    shadowOffset: { width: 0, height: 2 },
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    marginLeft: 45,
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: 10,
  },
  HomeIcon: {
    marginLeft: 10,
  },
})

export default NavBar
