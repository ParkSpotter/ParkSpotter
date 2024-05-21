import React, { useState } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNav from './navigation/AppNav'
import { ContextProvider } from './context/context'

const App = () => {
  return (
    <ContextProvider>
      <PaperProvider>
        <AppNav />
      </PaperProvider>
    </ContextProvider>
  )
}

export default App
