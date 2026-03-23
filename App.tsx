import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import CameraScreen from './src/screens/CameraScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import ResultScreen from './src/screens/ResultScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Camera"
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: '次元穿梭' }}
          />
          <Stack.Screen
            name="Character"
            component={CharacterScreen}
            options={{ title: '选择角色' }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{ title: '合成结果' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
