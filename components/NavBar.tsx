import React, { FC } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

const NavBar: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const title = route.params?.title || 'NavBar'

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Menu</Text>
      </TouchableOpacity>
    </View>
  )
}

// Define styles for the navigation bar
const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 18,
  },
})

export default NavBar
