import React, { FC } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import {
  Button,
  Appbar,
  Avatar,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import NavBar from '../components/NavBar'

const HomePage: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header> */}
      <NavBar route={route} navigation={navigation} />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Title
            title="Welcome to ParkSpotter"
            left={props => <Avatar.Icon {...props} icon="home" />}
          />
          <Card.Content>
            <Title>Home Page</Title>
            <Paragraph>Enjoy exploring our features.</Paragraph>
          </Card.Content>
        </Card>
        <Button
          icon="logout"
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ea',
  },
})

export default HomePage
