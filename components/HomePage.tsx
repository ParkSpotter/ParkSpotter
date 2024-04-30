import { FC } from 'react'
import { Text, View, Button } from 'react-native'

const HomePage: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
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
