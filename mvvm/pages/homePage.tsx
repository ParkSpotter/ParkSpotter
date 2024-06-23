import React, { FC, useEffect, useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {
  Button,
  Card,
  Title,
  Portal,
  Provider,
  FAB,
  Modal,
  TextInput,
} from 'react-native-paper'
import NavBar from '../components/NavBar'
import { auth, db } from '../../firebaseConfig'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore'
import MySpinner from '../components/Spinner'

const HomePage: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [userName, setUserName] = useState<string | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserName(userData?.email || null)
          setUserImage(userData?.image || null)
        }
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchGroups = () => {
      setIsLoading(true)
      const groupsCollection = collection(db, 'groups')
      const unsubscribe = onSnapshot(
        groupsCollection,
        snapshot => {
          const groupsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          setGroups(groupsList)
          setIsLoading(false)
        },
        error => {
          console.error('Error fetching groups: ', error)
          setIsLoading(false)
        }
      )

      return () => unsubscribe()
    }

    fetchGroups()
  }, [])

  const createGroup = async () => {
    if (auth.currentUser && newGroupName.trim()) {
      const groupData = {
        name: newGroupName,
        members: [auth.currentUser.uid],
      }

      try {
        setIsLoading(true)
        // Add the new group to the groups collection
        const docRef = await addDoc(collection(db, 'groups'), groupData)
        console.log('Document written with ID: ', docRef.id)

        // Add the new group to the user's groups array
        const userDocRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userDocRef, {
          groups: arrayUnion(docRef.id),
        })

        // Update local state
        setGroups([...groups, { ...groupData, id: docRef.id }])
        setModalVisible(false)
        setNewGroupName('')
      } catch (e) {
        console.error('Error adding document: ', e)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const navigateToGroup = (group: any) => {
    navigation.navigate('GroupPage', { group })
  }

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <NavBar route={route} navigation={navigation} />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
        <ScrollView>
          <View style={styles.content}>
            {isLoading && <MySpinner />}
            {!isLoading &&
              groups.map((group, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigateToGroup(group)}
                  style={{ width: '80%' }}
                >
                  <Card style={styles.card}>
                    <Card.Title
                      title={group.name}
                      subtitle={`Members: ${group.members.length}`}
                    />
                  </Card>
                </TouchableOpacity>
              ))}
          </View>

          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContent}
            >
              <Title>Create New Group</Title>
              <TextInput
                label="Group Name"
                value={newGroupName}
                onChangeText={setNewGroupName}
                mode="outlined"
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={createGroup}
                style={styles.modalButton}
              >
                Create
              </Button>
              <Button
                mode="text"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
            </Modal>
          </Portal>
        </ScrollView>
      </SafeAreaView>
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
  card: {
    width: '100%',
    marginBottom: 20,
  },
  sectionButton: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#6200ea',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ea',
  },
  fab: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#e0e0e0',
    marginTop: 75,
    marginRight: 330,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default HomePage
