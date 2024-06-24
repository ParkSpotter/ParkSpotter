import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
  View,
  TouchableOpacity,
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
} from 'react-native-paper'
import MySpinner from '../components/Spinner'
import { createClient } from 'pexels'

const client = createClient(
  'G1sn44GvaCpalI8NhnAp0pEo7ILem4cLJadQzyfCDw9nU9FjSnxLmCfP'
)
const { width, height } = Dimensions.get('window')

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
  const [carStatus, setCarStatus] = useState(false)
  const [isOccupiedBy, setIsOccupiedBy] = useState(null)

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
      console.error('Error fetching car photo: ', error)
    }
    return null
  }

  const handleAddCar = async () => {
    setIsLoading(true)
    if (carNumber.trim() && carType.trim()) {
      try {
        const carPhotoUrl = await getCarPhoto(carType)

        const groupDocRef = doc(db, 'groups', group.id!)
        const newCar = {
          number: carNumber,
          type: carType,
          photo: carPhotoUrl,
          available: carStatus,
          isOccupiedBy,
        }
        await updateDoc(groupDocRef, { cars: arrayUnion(newCar) })
        Alert.alert('Car added successfully!')
        setCarModalVisible(false)
        setCarNumber('')
        setCarType('')
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
    })
  }

  const navigateToMapPage = () => {
    navigation.navigate('MapPage', { group })
  }

  const isMember = group.members.includes(auth.currentUser?.uid)

  if (isLoading) return <MySpinner />
  return (
    <Provider>
      <View style={styles.container}>
        <NavBar route={route} navigation={navigation} title="Group" />
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
              <TouchableOpacity
                onPress={() => isMember && navigateToCarPage(item)}
                disabled={!isMember}
                style={{
                  backgroundColor: !item.available ? '#e0e0e0' : '#f0f0f0',
                }}
              >
                <View style={styles.carContainer}>
                  <Text
                    style={styles.carItem}
                  >{`${item.number} - ${item.type}`}</Text>
                  <Text style={styles.carStatus}>
                    {item.available ? 'Available' : 'Occupied'}
                  </Text>
                  <View style={styles.carActions}>
                    {auth.currentUser?.uid === group.creator_id && (
                      <IconButton
                        icon="delete"
                        onPress={() => handleDeleteCar(item)}
                        disabled={!isMember}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            style={styles.carsList}
          />

          <View style={styles.buttonContainer}>
            {!isMember ? (
              <PaperButton
                mode="contained"
                onPress={handleJoinGroup}
                icon={() => (
                  <MaterialCommunityIcons
                    name="account-plus"
                    size={30}
                    color="white"
                  />
                )}
                style={styles.iconButton}
              />
            ) : (
              <PaperButton
                mode="contained"
                onPress={handleLeaveGroup}
                icon={() => (
                  <MaterialCommunityIcons
                    name="account-remove"
                    size={30}
                    color="white"
                  />
                )}
                style={[styles.iconButton, styles.leaveButton]}
              />
            )}
            <PaperButton
              mode="contained"
              onPress={navigateToMapPage}
              icon={() => (
                <MaterialCommunityIcons name="map" size={30} color="white" />
              )}
              style={[styles.iconButton, styles.mapButton]}
              disabled={!isMember}
            />
            {isMember && (
              <PaperButton
                mode="contained"
                onPress={() => setCarModalVisible(true)}
                icon={() => (
                  <MaterialCommunityIcons name="car" size={30} color="white" />
                )}
                style={[styles.iconButton, styles.addButton]}
              />
            )}
            {auth.currentUser?.uid === group.creator_id && (
              <PaperButton
                mode="contained"
                onPress={handleDeleteGroup}
                icon={() => (
                  <MaterialCommunityIcons
                    name="delete"
                    size={30}
                    color="white"
                  />
                )}
                style={[styles.iconButton, styles.deleteButton]}
                disabled={!isMember}
              />
            )}
          </View>

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
                icon="car"
                style={styles.modalButton}
              >
                Add Car
              </PaperButton>
              <PaperButton
                mode="text"
                onPress={() => setCarModalVisible(false)}
                icon="cancel"
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
  carStatus: {
    fontSize: 14,
    color: '#555',
  },
  carActions: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 30,
    marginHorizontal: 5,
  },
  leaveButton: {
    backgroundColor: '#b00020',
  },
  mapButton: {
    backgroundColor: 'green',
  },
  addButton: {
    backgroundColor: '#6200ea',
  },
  deleteButton: {
    backgroundColor: '#b00020',
  },
  buttonLabel: {
    fontSize: 10,
  },
  fab: {
    backgroundColor: '#6200ea',
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  deleteButton: {
    backgroundColor: '#b00020',
    marginHorizontal: 5,
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
})

export default GroupPage
