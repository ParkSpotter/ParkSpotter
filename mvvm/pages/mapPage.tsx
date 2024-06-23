import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Text, View } from 'react-native'
import NavBar from '../components/NavBar'

const MapPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  return (
    <View style={styles.container}>
      <NavBar route={route} navigation={navigation} />
      <Text>Map Page</Text>
      <Pressable onPress={() => navigation.navigate('Home')}></Pressable>
      <Text>Go to Home</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default MapPage
