import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Modal, Image, Text, View } from 'react-native'
import NavBar from '../components/NavBar'
import { LatLng, LeafletView } from 'react-native-leaflet-view'
import * as Location from 'expo-location'
import MySpinner from '../components/Spinner'
import { Provider } from 'react-native-paper'

interface Car {
  location: LatLng
  number: string
  type: string
  available: boolean
  isOccupiedBy: string | null
  photo: string | null
  name: string
}

const MapPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [location, setLocation] = useState<LatLng | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [locationLoading, setLocationLoading] = useState<boolean>(true)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const { carList } = route.params

  useEffect(() => {
    const requestLocationPermission = async () => {
      console.log('Requesting location permission...')
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        console.log('Location permission granted')
        getCurrentLocation()
      } else {
        console.log('Location permission denied')
        setLoading(false)
      }
    }

    const getCurrentLocation = async () => {
      setLocationLoading(true)
      try {
        console.log('Getting current location...')
        const location = await Location.getCurrentPositionAsync({})
        console.log('Location:', location.coords)
        setLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        })
      } catch (error) {
        console.error('Error getting current location:', error)
      } finally {
        setLocationLoading(false)
      }
    }

    requestLocationPermission()
  }, [])

  useEffect(() => {
    if (location && !locationLoading) {
      setLoading(false)
    }
  }, [location, locationLoading])

  const filteredCarList = carList.filter(
    (car: Car) => car.available && car.isOccupiedBy === null
  )

  const handleMarkerPress = (car: Car) => {
    setSelectedCar(car)
  }

  const clearSelectedCar = () => {
    setSelectedCar(null)
  }

  if (loading) {
    return <MySpinner />
  }

  return (
    <Provider>
      <View style={styles.container}>
        <NavBar route={route} navigation={navigation} title="Map" />
        <View style={styles.map}>
          <LeafletView
            mapMarkers={filteredCarList.map((car: Car, index: number) => ({
              key: index.toString(),
              position: {
                lat: car.location.latitude,
                lng: car.location.longitude,
              },
              icon: '🚗',
              size: [32, 32],
              onPress: () => handleMarkerPress(car),
              title: `${car.type} - ${car.number}`,
              description: 'Tap to view details',
            }))}
            zoom={13}
            mapCenterPosition={location}
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
              <Text style={styles.modalTitle}>Car Details</Text>
              <Text>Type: {selectedCar?.type}</Text>
              <Text>Number: {selectedCar?.number}</Text>
              {selectedCar?.photo && (
                <Image
                  source={{ uri: selectedCar.photo }}
                  style={styles.carPhoto}
                  resizeMode="cover"
                />
              )}
              <Pressable onPress={clearSelectedCar} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carPhoto: {
    width: 200,
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default MapPage
