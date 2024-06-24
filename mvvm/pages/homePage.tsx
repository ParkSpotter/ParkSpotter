import React, { FC, useEffect, useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
import { Image, Text } from 'react-native-elements'

const { width, height } = Dimensions.get('window')

const HomePage: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const [userName, setUserName] = useState<string | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [myGroups, setMyGroups] = useState<any[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showMyGroups, setShowMyGroups] = useState(true)

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

          if (auth.currentUser) {
            const userGroups = groupsList.filter(group =>
              group.members.includes(auth.currentUser.uid)
            )
            setMyGroups(userGroups)
          }
          
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
        creator_id: auth.currentUser.uid,
      }

      try {
        setIsLoading(true)
        const docRef = await addDoc(collection(db, 'groups'), groupData)
        console.log('Document written with ID: ', docRef.id)

        const userDocRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userDocRef, {
          groups: arrayUnion(docRef.id),
        })

        setGroups([...groups, { ...groupData, id: docRef.id }])
        setMyGroups([...myGroups, { ...groupData, id: docRef.id }])
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
      <NavBar route={route} navigation={navigation} title="Home" />
      <SafeAreaView style={styles.container}>
        <View style={styles.fabContainer}>
          <FAB
            style={styles.fab}
            size="small"
            icon="plus"
            onPress={() => setModalVisible(true)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode={showMyGroups ? "contained" : "outlined"}
            onPress={() => setShowMyGroups(true)}
            style={styles.filterButton}
          >
            My Groups
          </Button>
          <Button
            mode={!showMyGroups ? "contained" : "outlined"}
            onPress={() => setShowMyGroups(false)}
            style={styles.filterButton}
          >
            All Groups
          </Button>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            {isLoading && <MySpinner />}
            {!isLoading &&
              (showMyGroups ? myGroups : groups).map((group, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigateToGroup(group)}
                  style={styles.cardContainer}
                >
                  <Card style={styles.card}>
                    <Card.Title
                      title={group.name}
                      subtitle={`Members: ${
                        group.members.length
                      }        Cars Number: ${
                        group.cars ? group.cars.length : 0
                      }`}
                      subtitleStyle={styles.cardSubtitle}
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
  cardSubtitle: {},
  fabContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  filterButton: {
    marginHorizontal: 5,
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  cardContainer: {
    width: '90%',
    marginBottom: 20,
  },
  card: {
    width: '100%',
  },
  fab: {
    marginTop: 20,
    backgroundColor: '#6200ea',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default HomePage
