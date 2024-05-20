import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNav from './navigation/AppNav' // Assuming AppNav is your main navigation component

const App = () => {
  return (
    <PaperProvider>
      <AppNav />
    </PaperProvider>
  )
}

export default App
