import React, { useState, useEffect } from 'react';
import { AppRegistry, LogBox } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNav from './mvvm/navigation/AppNav';

LogBox.ignoreAllLogs();
const App = () => {
  return (
    <PaperProvider>
      <AppNav />
    </PaperProvider>
  );
};

export default App;
