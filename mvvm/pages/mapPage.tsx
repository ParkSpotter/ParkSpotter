import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import NavBar from '../components/NavBar';
import { LeafletView, MapMarker } from 'react-native-leaflet-view';
//import RNLocation from 'react-native-location';


// RNLocation.configure({
//   distanceFilter: 5.0
// })

// RNLocation.requestPermission({
//   ios: "whenInUse",
//   android: {
//     detail: "coarse"
//   }
// }).then(granted => {
//   if (granted) {

//   }
// })

const markers = [
  { id: 1, position: { lat: 31.894756, lng: 34.809322 }, title: "Marker 1", description: "Description 1" },
];

const MapPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  return (
    <View style={styles.container}>
      <NavBar route={route} navigation={navigation} title='Map' />
      <Text>Map Page</Text>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text>Go to Home</Text>
      </Pressable>
      <View style={styles.map}>
        <LeafletView
          mapMarkers={markers.map(marker => ({
            position: marker.position,
            icon: '📍',
            size: [32, 32],
            onPress: () => {
            },
            title: marker.title,
            description: marker.description,
          }))}
          mapCenterPosition={{ lat: 51.505, lng: -0.09 }}
          zoom={13}
        />
      </View>
    </View>
  );
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
});

export default MapPage;