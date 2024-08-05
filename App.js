import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import currentStyle from "./src/style/style_manager"

import OverViewPage from './src/pages/Overview';
import TesteScreen from './src/pages/teste';

export default function App() {
  return (
    <OverViewPage />
    // <TesteScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: currentStyle.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
