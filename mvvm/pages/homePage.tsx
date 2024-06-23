import React, { FC, useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import {
  Button,
  Appbar,
  Avatar,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavBar from '../components/NavBar';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const HomePage: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData?.email || null);
          setUserImage(userData?.image || null); // Assuming the image URL is stored under the 'image' field
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NavBar route={route} navigation={navigation} />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Title
            title='Welcome to ParkSpotter'
            left={(props) => (
              <Avatar.Image
                {...props}
                source={{
                  uri:
                    userImage ||
                    'https://www.w3schools.com/howto/img_avatar.png',
                }}
              />
            )}
          />
          <Card.Content>
            <Title>Home Page</Title>
            <Paragraph>Enjoy exploring our features.</Paragraph>
          </Card.Content>
        </Card>

        <Button
          onPress={() => navigation.navigate('Cars')}
          icon='car'
          mode='contained'
          style={styles.sectionButton}
        >
          My Cars
        </Button>

        <Button
          onPress={() => navigation.navigate('Groups')}
          icon='account-group'
          mode='contained'
          style={styles.sectionButton}
        >
          My Groups
        </Button>

        <Button
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => navigation.navigate('Login'),
              },
            ]);
          }}
          icon='logout'
          mode='contained'
          style={styles.button}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

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

export default HomePage;
