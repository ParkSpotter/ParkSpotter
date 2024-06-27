import React, { useState, useEffect } from 'react';
import { AppRegistry, LogBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNav from './mvvm/navigation/AppNav';
import { setupDatabase } from './DatabaseService';
LogBox.ignoreAllLogs();
const App = () => {
  useEffect(() => {
    setupDatabase()
      .then(() => {
        console.log('Database setup completed');
      })
      .catch((error) => {
        console.error('Database setup failed:', error);
      });
  }, []);
  return (
    <PaperProvider>
      <AppNav />
    </PaperProvider>
  );
};

export default App;
