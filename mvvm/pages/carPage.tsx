import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Modal,
  Portal,
  Provider,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import MySpinner from '../components/Spinner';
import NavBar from '../components/NavBar';
import * as Location from 'expo-location';
const { width } = Dimensions.get('window');

const CarPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { car, group, carList, setCarList, carStatus, setCarStatus } =
    route.params;
  const [visible, setVisible] = useState(false);
  const [carName, setCarName] = useState(car.type);
  const [carNumber, setCarNumber] = useState(car.number);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(car.photo || null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isOccupied, setIsOccupied] = useState(!car.available);
  const [occupiedBy, setOccupiedBy] = useState(car.occupiedBy || null);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    if (pickerResult.canceled) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const pickedImage = pickerResult.assets[0];
      console.log(pickedImage.uri);
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
      console.log(downloadURL);
      setImage(downloadURL);
    }
  };

  const pickImage = async () => {
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
  };

  const takePhoto = async () => {
    setIsPhotoLoading(true);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
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
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const groupDocRef = doc(db, 'groups', group.id!);
      const updatedCars = group.cars.map((c: any) => {
        if (c.number === car.number) {
          return { ...c, type: carName, number: carNumber, photo: image };
        }
        return c;
      });
      await updateDoc(groupDocRef, {
        cars: updatedCars,
      });
      car.type = carName;
      car.number = carNumber;
      car.photo = image;
      hideModal();
      Alert.alert('Car details updated successfully!');
    } catch (error) {
      console.error('Error updating car details: ', error);
      Alert.alert('Error updating car details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleOccupied = async () => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser?.uid;
      const groupDocRef = doc(db, 'groups', group.id!);
      setCarStatus(!carStatus);
      setIsOccupied(!isOccupied);
      setOccupiedBy(occupiedBy ? null : currentUser);
      let newLocation = car.location;
      if (!isOccupied) {
        newLocation = (await Location.getCurrentPositionAsync({})).coords;
      }
      const updatedCar = {
        ...car,
        location: newLocation,
        available: isOccupied,
        occupiedBy: occupiedBy ? null : currentUser,
      };
      const updatedCarList = carList.map((c: any) =>
        c.number === car.number ? updatedCar : c
      );
      setCarList(updatedCarList);
      await updateDoc(groupDocRef, {
        cars: updatedCarList,
      });

      Alert.alert(
        `Car status updated to ${isOccupied ? 'Available' : 'Taken'}!`
      );
    } catch (error) {
      console.error('Error updating car status: ', error);
      Alert.alert('Error updating car status.');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return <MySpinner />;
  return (
    <Provider>
      <View style={styles.container}>
        <NavBar route={route} navigation={navigation} title='Car' />
        <View style={styles.content}>
          <Image
            source={{ uri: image || 'https://picsum.photos/200' }}
            style={styles.carImage}
          />
          <Text style={styles.carName}>{car.type}</Text>
          <Text style={styles.carNumber}>{car.number}</Text>
          <Button
            mode='contained'
            icon='pencil'
            onPress={showModal}
            style={styles.editButton}
          >
            Edit
          </Button>
          <Button
            mode='contained'
            icon='car'
            onPress={handleToggleOccupied}
            style={
              isOccupied
                ? styles.occupiedButton
                : {
                    ...styles.occupiedButton,
                    backgroundColor: '#4caf50',
                  }
            }
            disabled={isOccupied && occupiedBy !== auth.currentUser?.uid}
          >
            {isOccupied ? 'Taken' : 'Available'}
          </Button>
        </View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <TextInput
              label='Car Name'
              value={carName}
              onChangeText={(text) => setCarName(text)}
              style={styles.input}
            />
            <TextInput
              label='Car Number'
              value={carNumber}
              onChangeText={(text) => setCarNumber(text)}
              style={styles.input}
            />
            {isPhotoLoading ? (
              <MySpinner />
            ) : (
              <Image
                source={{ uri: image || 'https://picsum.photos/200' }}
                style={styles.carImage}
              />
            )}
            <Button
              mode='outlined'
              onPress={pickImage}
              style={styles.uploadButton}
            >
              Select Photo from Gallery
            </Button>
            <Button
              mode='outlined'
              onPress={takePhoto}
              style={styles.uploadButton}
            >
              Take a Photo
            </Button>
            <Button
              mode='contained'
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveButton}
            >
              Save
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
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
    width: '100%',
  },
  carImage: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#cccccc',
  },
  carName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Medium',
  },
  carNumber: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Light',
  },
  editButton: {
    marginTop: 10,
  },
  occupiedButton: {
    marginTop: 10,
    backgroundColor: '#b00020',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
  },
  uploadButton: {
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
  },
});

export default CarPage;
