import React, { useState } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNav from './navigation/AppNav'
import { createContext } from 'react'

export const Context = createContext({})

const App = () => {
  const [user, setUser] = useState({})
  return (
    <Context.Provider
      value={{
        user,
        setUser,
      }}
    >
      <PaperProvider>
        <AppNav />
      </PaperProvider>
    </Context.Provider>
  )
}

export default App
