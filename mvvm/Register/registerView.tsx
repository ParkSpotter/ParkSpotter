import React from 'react'
import { Text, View, Image } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useRegisterViewModel from './registerViewModel'
import { styles } from './registerStyles'
import MySpinner from '../components/Spinner'

const defaultPhotoUri = 'https://www.w3schools.com/howto/img_avatar.png'

const RegisterView: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    onSubmit,
    username,
    setUserName,
    isLoading,
    image,
    pickImage,
    takeSelfie,
    isPhotoLoading,
  } = useRegisterViewModel((route: string) => navigation.navigate(route))

  if (isLoading) {
    return <MySpinner />
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
        <Button mode="outlined" onPress={pickImage} style={styles.uploadButton}>
          Select Photo from Gallery
        </Button>
        <Button
          mode="outlined"
          onPress={takeSelfie}
          style={styles.uploadButton}
        >
          Take a Selfie
        </Button>
      </>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        left={
          <TextInput.Icon
            icon={() => <Icon name="email" size={20} color="#555" />}
          />
        }
        theme={{
          colors: {
            primary: '#6200ea',
            background: '#fff',
          },
        }}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUserName}
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
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        left={
          <TextInput.Icon
            icon={() => <Icon name="lock" size={20} color="#555" />}
          />
        }
        theme={{
          colors: {
            primary: '#6200ea',
            background: '#fff',
          },
        }}
      />
      <Button mode="contained" onPress={onSubmit} style={styles.button}>
        Register
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.textButton}
      >
        Go to Login
      </Button>
    </View>
  )
}

export default RegisterView
