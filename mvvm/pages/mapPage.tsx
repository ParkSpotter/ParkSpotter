import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Modal, Image } from 'react-native';
import { Text, View } from 'react-native';
import NavBar from '../components/NavBar';
import { LeafletView } from 'react-native-leaflet-view';
import * as Location from 'expo-location';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import MySpinner from '../components/Spinner';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Car {
  location: Coordinates;
  number: string;
  type: string;
  available: boolean;
  isOccupiedBy: string | null;
  photo: string | null; // Assuming photo is a URL or base64 encoded image
}

const MapPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      console.log('Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        console.log('Location permission granted');
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
        setLoading(false); 
      }
    };

    const getCurrentLocation = async () => {
      try {
        console.log('Getting current location...');
        const location = await Location.getCurrentPositionAsync({});
        console.log('Current location obtained:', location);
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting current location:', error);
      } finally {
        setLocationLoading(false);
      }
    };

    requestLocationPermission();
  }, []);

  // Handle press on a marker to show car details
  const handleMarkerPress = (car: Car) => {
    setSelectedCar(car);
  };

  // Clear selected car details
  const clearSelectedCar = () => {
    setSelectedCar(null);
  };

  if (loading || locationLoading || !location) {
    return <MySpinner />;
  }

  const { carList } = route.params;

  return (
    <View style={styles.container}>
      <NavBar route={route} navigation={navigation} title="Map" />
      <Text>Map Page</Text>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text>Go to Home</Text>
      </Pressable>
      <View style={styles.map}>
        <LeafletView
          mapMarkers={carList.map((car: Car, index: number) => ({
            position: { lat: car.location.latitude, lng: car.location.longitude },
            icon: '🚗',
            size: [32, 32],
            onPress: () => handleMarkerPress(car),
            title: `Car ${index + 1}`,
            description: `Type: ${car.type}, Number: ${car.number}`,
          }))}
          mapCenterPosition={location}
          zoom={13}
        />
      </View>
      {/* Modal to display selected car details */}
      <Modal
        visible={!!selectedCar}
        animationType="slide"
        transparent={true}
        onRequestClose={clearSelectedCar}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Car Details</Text>
            <Text>Type: {selectedCar?.type}</Text>
            <Text>Number: {selectedCar?.number}</Text>
            {selectedCar?.photo && (
              <Image
                source={{ uri: selectedCar.photo }} // Assuming photo is a URL
                style={styles.carPhoto}
                resizeMode="cover"
              />
            )}
            <Pressable onPress={clearSelectedCar}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  carPhoto: {
    width: 200,
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default MapPage;
