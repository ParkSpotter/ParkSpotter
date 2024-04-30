import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

const HomePage = ({ navigation }: { navigation: any }) => {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Logout"
        color="#1E6738"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  )
}
export default HomePage
