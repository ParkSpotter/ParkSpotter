import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert, Dimensions, View } from 'react-native'
import { Text, Button } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import NavBar from '../components/NavBar'
import { auth, db } from '../../firebaseConfig'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from 'firebase/firestore'
import {
  FAB,
  Modal,
  TextInput,
  Portal,
  Provider,
  Title,
  Button as PaperButton,
  IconButton,
} from 'react-native-paper'
import MySpinner from '../components/Spinner'

const { width, height } = Dimensions.get('window')

const GroupPage: React.FC<{
  navigation: any
  route: any
}> = ({ navigation, route }) => {
  const group: any = route.params.group
  const [memberDetails, setMemberDetails] = useState<any[]>([])
  const [carList, setCarList] = useState<any[]>(group.cars || [])
  const [isLoading, setIsLoading] = useState(false)
  const [carModalVisible, setCarModalVisible] = useState(false)
  const [carNumber, setCarNumber] = useState('')
  const [carType, setCarType] = useState('')
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [startHour, setStartHour] = useState<number | null>(null)
  const [endHour, setEndHour] = useState<number | null>(null)

  useEffect(() => {
    const fetchMemberDetails = async () => {
      const memberPromises = group.members.map(async (memberId: string) => {
        const memberDoc = await getDoc(doc(db, 'users', memberId))
        if (memberDoc.exists()) {
          const memberData = memberDoc.data()
          return {
            id: memberId,
            username: memberData?.username || 'Unknown User',
          }
        }
        return { id: memberId, username: 'Unknown User' }
      })
      const memberData = await Promise.all(memberPromises)
      setMemberDetails(memberData)
    }
    fetchMemberDetails()
  }, [group.members])

  const handleJoinGroup = async () => {
    setIsLoading(true)
    if (auth.currentUser) {
      const groupDocRef = doc(db, 'groups', group.id!)
      const userDocRef = doc(db, 'users', auth.currentUser.uid)

      try {
        // Check if the user is already a member of the group
        if (group.members.includes(auth.currentUser.uid)) {
          Alert.alert('You are already a member of this group.')
          return
        }

        // Start a batch
        const batch = writeBatch(db)

        // Update the group's members array
        batch.update(groupDocRef, {
          members: arrayUnion(auth.currentUser.uid),
        })

        // Update the user's groups array
        batch.update(userDocRef, {
          groups: arrayUnion(group.id),
        })

        // Commit the batch
        await batch.commit()

        Alert.alert('Joined the group successfully!')

        // Refresh the member list
        const memberDoc = await getDoc(userDocRef)
        if (memberDoc.exists()) {
          const newMemberData = {
            id: auth.currentUser.uid,
            username: memberDoc.data()?.username || 'Unknown User',
          }
          setMemberDetails([...memberDetails, newMemberData])
          // Update the group members to prevent the user from joining again
          group.members.push(auth.currentUser.uid)
        }
      } catch (error) {
        console.error('Error joining group: ', error)
        Alert.alert('Error joining the group.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleAddCar = async () => {
    setIsLoading(true)
    if (carNumber.trim() && carType.trim()) {
      try {
        // Add the car details to the Firestore (assuming cars are added to the group document)
        const groupDocRef = doc(db, 'groups', group.id!)
        const newCar = { number: carNumber, type: carType }
        await updateDoc(groupDocRef, {
          cars: arrayUnion(newCar),
        })
        Alert.alert('Car added successfully!')
        setCarModalVisible(false)
        setCarNumber('')
        setCarType('')
        setCarList(prevCars => [...prevCars, newCar]) // Update local state
      } catch (error) {
        console.error('Error adding car: ', error)
        Alert.alert('Error adding car.')
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
      Alert.alert('Please fill out all fields.')
    }
  }

  const handleDeleteCar = async (car: any) => {
    setIsLoading(true)
    try {
      const groupDocRef = doc(db, 'groups', group.id!)
      await updateDoc(groupDocRef, {
        cars: arrayRemove(car),
      })
      Alert.alert('Car deleted successfully!')
      setCarList(prevCars => prevCars.filter(c => c.number !== car.number))
    } catch (error) {
      console.error('Error deleting car: ', error)
      Alert.alert('Error deleting car.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleCar = (car: any) => {
    setSelectedCar(car)
    setScheduleModalVisible(true)
  }

  const handleConfirmSchedule = async () => {
    if (startHour === null || endHour === null || startHour >= endHour) {
      Alert.alert('Please select a valid start and end hour.')
      return
    }
    setIsLoading(true)
    try {
      const groupDocRef = doc(db, 'groups', group.id!)
      const updatedCars = carList.map(car => {
        if (car.number === selectedCar.number) {
          return { ...car, scheduledHours: { start: startHour, end: endHour } }
        }
        return car
      })
      await updateDoc(groupDocRef, {
        cars: updatedCars,
      })
      Alert.alert('Car scheduled successfully!')
      setScheduleModalVisible(false)
      setCarList(updatedCars) // Update local state
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
    <Provider>
      <View style={styles.container}>
        <NavBar route={route} navigation={navigation} />
        <View style={styles.content}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.sectionTitle}>Members:</Text>
          <FlatList
            data={memberDetails}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Text style={styles.memberItem}>{item.username}</Text>
            )}
            style={styles.membersList}
          />

          <Text style={styles.sectionTitle}>Cars:</Text>
          <FlatList
            data={carList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.carContainer}>
                <Text
                  style={styles.carItem}
                >{`${item.number} - ${item.type}`}</Text>
                <View style={styles.carActions}>
                  <IconButton
                    icon="delete"
                    color="#f00"
                    onPress={() => handleDeleteCar(item)}
                  />
                  <IconButton
                    icon="calendar"
                    color="#00f"
                    onPress={() => handleScheduleCar(item)}
                  />
                </View>
              </View>
            )}
            style={styles.carsList}
          />

          <FAB
            style={styles.fab}
            icon="car"
            onPress={() => setCarModalVisible(true)}
          />

          <Button title="Join Group" onPress={handleJoinGroup} />
          <Portal>
            <Modal
              visible={carModalVisible}
              onDismiss={() => setCarModalVisible(false)}
              contentContainerStyle={styles.modalContent}
            >
              <Title>Add Car</Title>
              <TextInput
                label="Car Number"
                value={carNumber}
                onChangeText={setCarNumber}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Car Type"
                value={carType}
                onChangeText={setCarType}
                mode="outlined"
                style={styles.input}
              />
              <PaperButton
                mode="contained"
                onPress={handleAddCar}
                style={styles.modalButton}
              >
                Add Car
              </PaperButton>
              <PaperButton
                mode="text"
                onPress={() => setCarModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </PaperButton>
            </Modal>

            <Modal
              visible={scheduleModalVisible}
              onDismiss={() => setScheduleModalVisible(false)}
              contentContainerStyle={styles.modalContent}
            >
              <Title>Schedule Car</Title>
              <View style={styles.pickerContainer}>
                <Text>Start Hour:</Text>
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
                <Text>End Hour:</Text>
                <Picker
                  mode="dialog"
                  selectedValue={endHour}
                  onValueChange={itemValue => setEndHour(itemValue)}
                  style={styles.picker}
                >
                  {renderHourOptions()}
                </Picker>
              </View>
              <PaperButton
                mode="contained"
                onPress={handleConfirmSchedule}
                style={styles.modalButton}
              >
                Confirm
              </PaperButton>
              <PaperButton
                mode="text"
                onPress={() => setScheduleModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </PaperButton>
            </Modal>
          </Portal>
        </View>
      </View>
    </Provider>
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
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  membersList: {
    width: '100%',
    marginBottom: 20,
  },
  memberItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    textAlign: 'center',
  },
  carsList: {
    width: '100%',
    marginBottom: 20,
  },
  carContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  carItem: {
    fontSize: 16,
  },
  carActions: {
    flexDirection: 'row',
  },
  scheduleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scheduleButton: {
    margin: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ea',
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 10,
  },
  pickerContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    height: 44,
    marginBottom: 150,
  },
})

export default GroupPage
