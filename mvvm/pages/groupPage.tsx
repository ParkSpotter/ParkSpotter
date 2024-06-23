import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert } from 'react-native'
import { Text, View, Button } from 'react-native'
import NavBar from '../components/NavBar'
import { GroupModel } from '../Models/groupModel'
import { auth, db } from '../../firebaseConfig'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
} from 'firebase/firestore'
import MySpinner from '../components/Spinner'

const GroupPage: React.FC<{
  navigation: any
  route: any
}> = ({ navigation, route }) => {
  const group: any = route.params.group
  const [memberDetails, setMemberDetails] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
  if (isLoading) return <MySpinner />
  return (
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
        <Button title="Join Group" onPress={handleJoinGroup} />
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
})

export default GroupPage
