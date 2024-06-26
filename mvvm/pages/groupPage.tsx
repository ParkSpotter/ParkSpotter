import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Text } from 'react-native'
import NavBar from '../components/NavBar'
import { auth, db } from '../../firebaseConfig'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
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
  Card,
} from 'react-native-paper'
import MySpinner from '../components/Spinner'
import { createClient } from 'pexels'

const client = createClient(
  'G1sn44GvaCpalI8NhnAp0pEo7ILem4cLJadQzyfCDw9nU9FjSnxLmCfP'
)
const { width, height } = Dimensions.get('window')
type CoordinatesType = {
  latitude: number
  longitude: number
}
const location: CoordinatesType = {
  latitude: 31.96102,
  longitude: 34.80162,
}
const GroupPage: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const group: any = route.params.group
  const [memberDetails, setMemberDetails] = useState<any[]>([])
  const [carList, setCarList] = useState<any[]>(group.cars || [])
  const [isLoading, setIsLoading] = useState(false)
  const [carModalVisible, setCarModalVisible] = useState(false)
  const [carNumber, setCarNumber] = useState('')
  const [carType, setCarType] = useState('')
  const [carStatus, setCarStatus] = useState(true)
  const [isOccupiedBy, setIsOccupiedBy] = useState(null)

  const isMember = group.members.includes(auth.currentUser?.uid)

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

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true)
      try {
        const groupDoc = await getDoc(doc(db, 'groups', group.id!))
        if (groupDoc.exists()) {
          setCarList(groupDoc.data()?.cars || [])
        }
      } catch (error) {
        console.error('Error fetching cars: ', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCars()
  }, [group.id])

  const handleJoinGroup = async () => {
    setIsLoading(true)
    if (auth.currentUser) {
      const groupDocRef = doc(db, 'groups', group.id!)
      const userDocRef = doc(db, 'users', auth.currentUser.uid)

      try {
        if (group.members.includes(auth.currentUser.uid)) {
          Alert.alert('You are already a member of this group.')
          return
        }

        const batch = writeBatch(db)
        batch.update(groupDocRef, { members: arrayUnion(auth.currentUser.uid) })
        batch.update(userDocRef, { groups: arrayUnion(group.id) })
        await batch.commit()

        Alert.alert('Joined the group successfully!')

        const memberDoc = await getDoc(userDocRef)
        if (memberDoc.exists()) {
          const newMemberData = {
            id: auth.currentUser.uid,
            username: memberDoc.data()?.username || 'Unknown User',
          }
          setMemberDetails([...memberDetails, newMemberData])
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

  const handleLeaveGroup = async () => {
    setIsLoading(true)
    if (auth.currentUser) {
      const groupDocRef = doc(db, 'groups', group.id!)
      const userDocRef = doc(db, 'users', auth.currentUser.uid)

      try {
        if (!group.members.includes(auth.currentUser.uid)) {
          Alert.alert('You are not a member of this group.')
          return
        }

        const batch = writeBatch(db)
        batch.update(groupDocRef, {
          members: arrayRemove(auth.currentUser.uid),
        })
        batch.update(userDocRef, { groups: arrayRemove(group.id) })
        await batch.commit()

        Alert.alert('Left the group successfully!')

        setMemberDetails(
          memberDetails.filter(member => member.id !== auth.currentUser.uid)
        )
        group.members = group.members.filter(
          (id: string) => id !== auth.currentUser.uid
        )
      } catch (error) {
        console.error('Error leaving group: ', error)
        Alert.alert('Error leaving the group.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getCarPhoto = async (query: string) => {
    try {
      const photos = await client.photos.search({ query, per_page: 1 })
      if (photos && photos.photos && photos.photos.length > 0) {
        const photoUrl = photos.photos[0].src.original
        return photoUrl
      }
    } catch (error) {
      console.log('test')
      console.error('Error fetching car photo: ', error)
    }
    return null
  }

  const handleAddCar = async () => {
    setIsLoading(true)
    if (carNumber.trim() && carType.trim()) {
      const query = 'profile picture of a ' + carType + ' car'
      try {
        const carPhotoUrl = await getCarPhoto(query)

        const groupDocRef = doc(db, 'groups', group.id!)
        const newCar = {
          number: carNumber,
          type: carType,
          photo: carPhotoUrl,
          available: carStatus,
          isOccupiedBy,
          location,
        }
        await updateDoc(groupDocRef, { cars: arrayUnion(newCar) })
        Alert.alert('Car added successfully!')
        setCarModalVisible(false)
        setCarList(prevCars => [...prevCars, newCar])
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
      await updateDoc(groupDocRef, { cars: arrayRemove(car) })
      Alert.alert('Car deleted successfully!')
      setCarList(prevCars => prevCars.filter(c => c.number !== car.number))
    } catch (error) {
      console.error('Error deleting car: ', error)
      Alert.alert('Error deleting car.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (auth.currentUser?.uid !== group.creator_id) {
      Alert.alert('You are not authorized to delete this group.')
      return
    }
    setIsLoading(true)
    try {
      await deleteDoc(doc(db, 'groups', group.id!))
      Alert.alert('Group deleted successfully!')
      navigation.goBack()
    } catch (error) {
      console.error('Error deleting group: ', error)
      Alert.alert('Error deleting group.')
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToCarPage = (car: any) => {
    navigation.navigate('CarPage', {
      car,
      group,
      setCarStatus,
      carStatus,
      isOccupiedBy,
      setIsOccupiedBy,
      setCarList,
      carList,
    })
  }

  const navigateToMapPage = () => {
    navigation.navigate('MapPage', { carList })
  }

  if (isLoading) return <MySpinner />
  return (
    <Provider>
      <View style={styles.container}>
        <NavBar route={route} navigation={navigation} title="Group" />
        <ScrollView contentContainerStyle={styles.content}>
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
          {carList.length > 0 ? (
            <FlatList
              data={carList}
              keyExtractor={item => item.number}
              renderItem={({ item }) => (
                <Card
                  style={
                    isMember
                      ? styles.carCard
                      : { ...styles.carCard, opacity: 0.5 }
                  }
                  onPress={() => navigateToCarPage(item)}
                  disabled={!isMember}
                >
                  {item.photo && (
                    <Card.Cover
                      source={{ uri: item.photo }}
                      style={styles.carImage}
                    />
                  )}
                  <Card.Content>
                    <Title>{item.type}</Title>
                    <Text>Number: {item.number}</Text>
                    <Text
                      style={
                        item.available ? { color: 'green' } : { color: 'red' }
                      }
                    >
                      Status: {item.available ? 'Available' : 'Taken'}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    {isMember && (
                      <PaperButton onPress={() => handleDeleteCar(item)}>
                        Delete
                      </PaperButton>
                    )}
                  </Card.Actions>
                </Card>
              )}
              style={styles.carsList}
            />
          ) : (
            <Text>No cars in this group.</Text>
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={navigateToMapPage}
          >
            <MaterialCommunityIcons name="map" color="#fff" size={20} />
            <Text style={styles.buttonText}>View Map</Text>
          </TouchableOpacity>
          {isMember ? (
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveGroup}
            >
              <MaterialCommunityIcons name="logout" color="#fff" size={20} />
              <Text style={styles.buttonText}>Leave Group</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinGroup}
            >
              <MaterialCommunityIcons name="login" color="#fff" size={20} />
              <Text style={styles.buttonText}>Join Group</Text>
            </TouchableOpacity>
          )}
          {auth.currentUser?.uid === group.creator_id && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteGroup}
            >
              <MaterialCommunityIcons name="delete" color="#fff" size={20} />
              <Text style={styles.buttonText}>Delete Group</Text>
            </TouchableOpacity>
          )}
        </View>

        {isMember && (
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => setCarModalVisible(true)}
          />
        )}
        <Portal>
          <Modal
            visible={carModalVisible}
            onDismiss={() => setCarModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Add Car</Text>
            <TextInput
              label="Car Number"
              value={carNumber}
              onChangeText={setCarNumber}
              style={styles.input}
            />
            <TextInput
              label="Car Type"
              value={carType}
              onChangeText={setCarType}
              style={styles.input}
            />
            <View style={styles.modalButtonContainer}>
              <PaperButton mode="contained" onPress={handleAddCar}>
                Add
              </PaperButton>
              <PaperButton onPress={() => setCarModalVisible(false)}>
                Cancel
              </PaperButton>
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
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
    marginVertical: 10,
  },
  membersList: {
    marginBottom: 20,
  },
  memberItem: {
    fontSize: 16,
    paddingVertical: 5,
  },
  carsList: {
    marginBottom: 20,
  },
  carCard: {
    marginBottom: 10,
  },
  carImage: {
    height: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mapButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  joinButton: {
    backgroundColor: '#2196f3',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  leaveButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#ff5722',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
  fab: {
    flexDirection: 'row',
    position: 'absolute',
    right: 20,
    top: 120,
    backgroundColor: '#2196f3',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default GroupPage
