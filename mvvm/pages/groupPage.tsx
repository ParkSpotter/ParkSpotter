import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert } from 'react-native'
import { Text, View, Button } from 'react-native'
import NavBar from '../components/NavBar'
import { auth, db } from '../../firebaseConfig'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
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
} from 'react-native-paper'
import MySpinner from '../components/Spinner'

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
  const [isCarActive, setIsCarActive] = useState(false)

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
        setCarList([...carList, newCar]) // Update local state
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
              <Text
                style={styles.carItem}
              >{`${item.number} - ${item.type}`}</Text>
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
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  carsList: {
    width: '100%',
    marginBottom: 20,
  },
  carItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ea',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    marginLeft: '10%',
  },
  input: {
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 10,
  },
})

export default GroupPage
