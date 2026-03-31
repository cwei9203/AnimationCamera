import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import CameraScreen from './src/screens/CameraScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import ResultScreen from './src/screens/ResultScreen';
import { RootStackParamList } from './src/types';
import { SessionProvider } from './src/session/sessionStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SessionProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Camera"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="Character" component={CharacterScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
