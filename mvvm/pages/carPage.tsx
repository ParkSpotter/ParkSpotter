import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, Image, Alert } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import NavBar from '../components/NavBar'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import MySpinner from '../components/Spinner'

const { width } = Dimensions.get('window')

const CarPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const car = route.params.car
  const group = route.params.group
  const [isLoading, setIsLoading] = useState(false)
  const [startHour, setStartHour] = useState<number | null>(null)
  const [endHour, setEndHour] = useState<number | null>(null)
  const [reschedule, setReschedule] = useState(false)

  const handleConfirmSchedule = async () => {
    if (startHour === null || endHour === null || startHour >= endHour) {
      Alert.alert('Please select a valid start and end hour.')
      return
    }
    setIsLoading(true)
    try {
      const groupDocRef = doc(db, 'groups', group.id!)
      const updatedCars = group.cars.map((c: any) => {
        if (c.number === car.number) {
          return { ...c, scheduledHours: { start: startHour, end: endHour } }
        }
        return c
      })
      await updateDoc(groupDocRef, {
        cars: updatedCars,
      })
      Alert.alert('Car scheduled successfully!')
      navigation.goBack()
    } catch (error) {
      console.error('Error scheduling car: ', error)
      Alert.alert('Error scheduling car.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderHourOptions = () => {
    return Array.from({ length: 24 }, (_, i) => (
      <Picker.Item key={i} label={`${i}:00`} value={i} />
    ))
  }

  if (isLoading) return <MySpinner />

  return (
    <View style={styles.container}>
      <NavBar route={route} navigation={navigation} title="Car" />
      <View style={styles.content}>
        <Image
          source={{ uri: car.photo || 'https://picsum.photos/200' }}
          style={styles.carImage}
        />
        <Text style={styles.carName}>{car.type}</Text>
        <Text style={styles.carNumber}>{car.number}</Text>

        {car.scheduledHours && !reschedule ? (
          <>
            <Text style={styles.scheduleInfo}>
              Car is scheduled from {car.scheduledHours.start}:00 to{' '}
              {car.scheduledHours.end}:00
            </Text>
            <Button
              mode="contained"
              onPress={() => setReschedule(true)}
              style={styles.scheduleButton}
            >
              Reschedule Car
            </Button>
          </>
        ) : (
          <>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Start Hour:</Text>
              <Picker
                mode="dropdown"
                selectedValue={startHour}
                onValueChange={itemValue => setStartHour(itemValue)}
                style={styles.picker}
              >
                {renderHourOptions()}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>End Hour:</Text>
              <Picker
                mode="dropdown"
                selectedValue={endHour}
                onValueChange={itemValue => setEndHour(itemValue)}
                style={styles.picker}
              >
                {renderHourOptions()}
              </Picker>
            </View>
            <Button
              mode="contained"
              onPress={handleConfirmSchedule}
              style={styles.scheduleButton}
            >
              Schedule Car
            </Button>
          </>
        )}
      </View>
    </View>
  )
}

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
  scheduleInfo: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue',
  },
  pickerContainer: {
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  pickerLabel: {
    color: '#333333',
    marginBottom: 5,
    fontFamily: 'HelveticaNeue-Medium',
  },
  picker: {
    width: '100%',
    height: 44,
    color: '#333333',
  },
  scheduleButton: {
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#4CAF50',
  },
})

export default CarPage
