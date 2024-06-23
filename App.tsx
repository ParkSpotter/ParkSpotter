import React, { useState } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNav from './mvvm/navigation/AppNav'

const App = () => {
  return (
    <PaperProvider>
      <AppNav />
    </PaperProvider>
  )
}

export default App
