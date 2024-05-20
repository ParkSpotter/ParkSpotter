import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Appbar, Menu, Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const NavBar: FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const [visible, setVisible] = React.useState(false)

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  const title = route.params?.title || 'NavBar'

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title={title} />
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
        <Menu.Item onPress={() => {}} title="Option 1" />
        <Menu.Item onPress={() => {}} title="Option 2" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Option 3" />
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
