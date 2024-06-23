import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Image, Alert } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker'
import MySpinner from '../components/Spinner'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { auth, db } from '../../firebaseConfig'
import { doc, updateDoc, getDoc } from 'firebase/firestore' // Import getDoc

const defaultPhotoUri = 'https://www.w3schools.com/howto/img_avatar.png'

const EditProfile: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [username, setUserName] = useState('')
  const userId = auth.currentUser?.uid!
  const [userImage, setUserImage] = useState<string | null>(null)
  const [isLoading, setisLoading] = useState(false)
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsPhotoLoading(true)
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserImage(userData?.image || null)
          setUserName(userData?.username || '')
        }
      }
      setIsPhotoLoading(false)
    }
    fetchUserData()
  }, [])

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    setisLoading(true)
    if (pickerResult.canceled) {
      setisLoading(false)
      return
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const pickedImage = pickerResult.assets[0]
      console.log(pickedImage.uri)
      const response = await fetch(pickedImage.uri)
      const blob = await response.blob()
      const filename = pickedImage.uri.substring(
        pickedImage.uri.lastIndexOf('/') + 1
      )
      const storage = getStorage()
      const storageRef = ref(storage, `Images/${filename}`)
      await uploadBytes(storageRef, blob)

      setisLoading(true)
      const downloadURL = await getDownloadURL(storageRef)
      setisLoading(false)
      console.log(downloadURL)
      setUserImage(downloadURL)
    }
  }

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!')
      return
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    await handleImagePicked(pickerResult)
  }

  const takeSelfie = async () => {
    setisLoading(true)
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera is required!')
      return
    }
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    await handleImagePicked(pickerResult)
    setisLoading(false)
  }

  const onSaveChanges = async () => {
    const userDocRef = doc(db, 'users', userId)
    await updateDoc(userDocRef, {
      image: userImage,
      username,
    })
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <MySpinner />
      ) : (
        <>
          {isPhotoLoading ? (
            <MySpinner />
          ) : (
            <Image
              source={{ uri: userImage || defaultPhotoUri }}
              style={styles.profileImage}
            />
          )}
          <Button
            mode="outlined"
            onPress={pickImage}
            style={styles.uploadButton}
          >
            Select Photo from Gallery
          </Button>
          <Button
            mode="outlined"
            onPress={takeSelfie}
            style={styles.uploadButton}
          >
            Take a Selfie
          </Button>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUserName}
            placeholder={username}
            style={styles.input}
            left={
              <TextInput.Icon
                icon={() => <Icon name="account" size={20} color="#555" />}
              />
            }
            theme={{
              colors: {
                primary: '#6200ea',
                background: '#fff',
              },
            }}
          />
          <Button
            mode="contained"
            onPress={onSaveChanges}
            style={styles.button}
          >
            Save Changes
          </Button>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
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
})

export default EditProfile
