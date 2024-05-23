import { StyleSheet } from 'react-native'

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  image: {
    height: 160,
    width: 170,
    marginTop: 20,
    borderRadius: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 40,
    color: '#333',
  },
  inputView: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  forgetText: {
    fontSize: 11,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ea',
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 50,
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
    paddingTop: 150,
  },
  signup: {
    color: 'darkblue',
    fontSize: 13,
    alignSelf: 'center',
  },
})
