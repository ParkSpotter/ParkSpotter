import React, { FC } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Appbar, Menu, Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const NavBar: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const [visible, setVisible] = React.useState(false)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Appbar.Header>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon={() => <Icon name="menu" size={24} />}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item onPress={() => navigation.navigate('Home')} title="Home" />
        <Menu.Item
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              {
                text: 'No',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => navigation.navigate('Login'),
              },
            ])
          }}
          title="LogOut"
        />
        <Divider />
      </Menu>
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 18,
  },
})

export default NavBar
