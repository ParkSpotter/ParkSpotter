import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Text, View, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import MySpinner from '../components/Spinner';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';
import { createUser } from '../Models/userModel';

const defaultPhotoUri = 'https://www.w3schools.com/howto/img_avatar.png';

const RegisterView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const dbSQL = useSQLiteContext();

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    try {
      if (pickerResult.canceled) {
        return;
      }

      if (pickerResult.assets && pickerResult.assets.length > 0) {
        const pickedImage = pickerResult.assets[0];
        const response = await fetch(pickedImage.uri);
        const blob = await response.blob();
        const filename = pickedImage.uri.substring(
          pickedImage.uri.lastIndexOf('/') + 1
        );
        const storage = getStorage();
        const storageRef = ref(storage, `Images/${filename}`);
        await uploadBytes(storageRef, blob);

        setIsPhotoLoading(true);
        const downloadURL = await getDownloadURL(storageRef);
        setIsPhotoLoading(false);
        setImage(downloadURL);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert(
        'Image Upload Failed',
        'There was an error while uploading the image. Please try again.'
      );
      setIsPhotoLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission to access camera roll is required!');
        return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      await handleImagePicked(pickerResult);
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Image Picker Error',
        'An error occurred while picking the image. Please try again.'
      );
    }
  };

  const takeSelfie = async () => {
    try {
      setIsPhotoLoading(true);
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission to access camera is required!');
        return;
      }
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      await handleImagePicked(pickerResult);
      setIsPhotoLoading(false);
    } catch (error) {
      console.error('Error taking selfie:', error);
      Alert.alert(
        'Camera Error',
        'An error occurred while taking the selfie. Please try again.'
      );
      setIsPhotoLoading(false);
    }
  };

  const saveUserData = async (email: string, password: string) => {
    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
    } catch (error) {
      console.error('Failed to save user data to AsyncStorage', error);
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        id: userCredential.user.uid,
        email,
        username,
        password,
        groups: [],
        cars: [],
        image: image || null,
      });
      await saveUserData(email, password);
      await createUser(dbSQL, {
        id: userCredential.user.uid,
        email,
        cars: [],
        groups: [],
        image: image || null,
        password,
        username,
      });

      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Registration Failed', error);
      Alert.alert('Registration Failed', error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setEmail('');
      setPassword('');
      setUserName('');
      setImage(null);
    }
  };

  if (isLoading) {
    return <MySpinner />;
  }

  return (
    <View style={styles.container}>
      <>
        <Text style={styles.title}>Register</Text>
        {isPhotoLoading ? (
          <MySpinner />
        ) : (
          <Image
            source={{ uri: image || defaultPhotoUri }}
            style={styles.profileImage}
          />
        )}
        <Button mode='outlined' onPress={pickImage} style={styles.uploadButton}>
          Select Photo from Gallery
        </Button>
        <Button
          mode='outlined'
          onPress={takeSelfie}
          style={styles.uploadButton}
        >
          Take a Selfie
        </Button>
      </>
      <TextInput
        label='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        left={
          <TextInput.Icon
            icon={() => <Icon name='email' size={20} color='#555' />}
          />
        }
        theme={{ colors: { primary: '#6200ea', background: '#fff' } }}
      />
      <TextInput
        label='Username'
        value={username}
        onChangeText={setUserName}
        style={styles.input}
        left={
          <TextInput.Icon
            icon={() => <Icon name='account' size={20} color='#555' />}
          />
        }
        theme={{ colors: { primary: '#6200ea', background: '#fff' } }}
      />
      <TextInput
        label='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        left={
          <TextInput.Icon
            icon={() => <Icon name='lock' size={20} color='#555' />}
          />
        }
        theme={{ colors: { primary: '#6200ea', background: '#fff' } }}
      />
      <Button mode='contained' onPress={onSubmit} style={styles.button}>
        Register
      </Button>
      <Button
        mode='text'
        onPress={() => navigation.navigate('Login')}
        style={styles.textButton}
      >
        Go to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ea',
  },
  textButton: {
    marginVertical: 10,
  },
});

export default RegisterView;
