import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ea',
  },
  textButton: {
    marginVertical: 10,
  },
})