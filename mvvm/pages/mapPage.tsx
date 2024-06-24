import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Text, View } from 'react-native'
import NavBar from '../components/NavBar'
import { LeafletView, MapMarker } from 'react-native-leaflet-view'
import * as Location from 'expo-location'

const markers = [
  {
    id: 1,
    position: { lat: 31.894756, lng: 34.809322 },
    title: 'Marker 1',
    description: 'Description 1',
  },
]

const MapPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  )

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        getCurrentLocation()
      } else {
        console.log('Location permission denied')
      }
    }

    const getCurrentLocation = async () => {
      const location = await Location.getCurrentPositionAsync({})
      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      })
    }

    requestLocationPermission()
  }, [])

  return (
    <View style={styles.container}>
      <NavBar route={route} navigation={navigation} title="Map" />
      <Text>Map Page</Text>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text>Go to Home</Text>
      </Pressable>
      <View style={styles.map}>
        {location ? (
          <LeafletView
            mapMarkers={markers.map(marker => ({
              position: marker.position,
              icon: '📍',
              size: [32, 32],
              onPress: () => {},
              title: marker.title,
              description: marker.description,
            }))}
            mapCenterPosition={location}
            zoom={13}
          />
        ) : (
          <Text>Loading your location...</Text>
        )}
      </View>
    </View>
  )
}

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
})

export default MapPage
