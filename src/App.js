/**
 * Building Navigation React Native App
 * Converted from Python prototype
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar, Platform} from 'react-native';

import BuildingSelectionScreen from './screens/BuildingSelectionScreen';
import RoomSearchScreen from './screens/RoomSearchScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f8f9fa" 
        translucent={Platform.OS === 'android'}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="BuildingSelection"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen 
            name="BuildingSelection" 
            component={BuildingSelectionScreen} 
          />
          <Stack.Screen 
            name="RoomSearch" 
            component={RoomSearchScreen} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;