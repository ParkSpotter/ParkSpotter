import React, { useState, useEffect } from 'react'

import { Provider as PaperProvider } from 'react-native-paper'
import AppNav from './mvvm/navigation/AppNav'
import { setupDatabase } from './DatabaseService'

const App = () => {
  //   useEffect(() => {
  //     const initializeDatabase = async () => {
  //       try {
  //         await setupDatabase()
  //         console.log('Database setup complete.')
  //       } catch (error) {
  //         console.error('Failed to set up the database:', error)
  //       }
  //     }
  //     initializeDatabase()
  //   }, [])
  return (
    <PaperProvider>
      <AppNav />
    </PaperProvider>
  )
}

export default App
