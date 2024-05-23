import { View, ActivityIndicator, StyleSheet } from 'react-native'

const MySpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6200ea" style={styles.spinner} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginTop: '20%',
    width: 100,
    height: 100,
  },
})

export default MySpinner
