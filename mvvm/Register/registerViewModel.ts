import { useState } from 'react'
import { Alert } from 'react-native'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import { auth, db } from '../../firebaseConfig'
import { RegisterViewModel } from './registerModel'

const useRegisterViewModel = (
  navigate: (route: string) => void
): RegisterViewModel => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    if (pickerResult.canceled) {
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

      setIsPhotoLoading(true)
      const downloadURL = await getDownloadURL(storageRef)
      setIsPhotoLoading(false)
      console.log(downloadURL)
      setImage(downloadURL)
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
    setIsPhotoLoading(true)
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
    setIsPhotoLoading(false)
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const userDocRef = doc(db, 'users', userCredential.user.uid)
      await setDoc(userDocRef, {
        id: userCredential.user.uid,
        email,
        username,
        password,
        groups: [],
        cars: [],
        image: image || null, // Save the image URL in the user document
      })

      setIsLoading(false)
      navigate('Login')
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message)
      setIsLoading(false)
    }
  }

  return {
    email,
    username,
    setUserName,
    setEmail,
    password,
    setPassword,
    onSubmit,
    isLoading,
    setIsLoading,
    image,
    setImage,
    pickImage,
    takeSelfie,
    isPhotoLoading,
    setIsPhotoLoading,
  }
}

export default useRegisterViewModel
