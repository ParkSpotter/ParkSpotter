import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import NavBar from '../components/NavBar';
import { auth } from '../firebaseConfig';

const HomePage: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
    const userName=JSON.stringify(auth?.currentUser?.email)
    return (
      <SafeAreaView style={styles.container}>
        {/* <Appbar.Header>
          <Appbar.Content title="Home" />
          <Appbar.Action icon="dots-vertical" onPress={() => {}} />
        </Appbar.Header> */}
        <NavBar route={route} navigation={navigation} />
        <View style={styles.content}>
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
    sectionButton: {
      marginTop: 20,
      width: '90%',
      backgroundColor: '#6200ea',
    },
    button: {
      marginTop: 20,
      backgroundColor: '#6200ea',
    },
  });