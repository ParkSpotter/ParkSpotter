import { FC } from 'react'
import { Text, View, Button, StyleSheet } from 'react-native'
import NavBar from '../components/NavBar'

const HomePage: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <NavBar route={route} navigation={navigation} />
      <Text style={styles.title}>Home Page</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          color="#1E6738"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  buttonContainer: {
    padding: 20,
  },
})

export default HomePage
