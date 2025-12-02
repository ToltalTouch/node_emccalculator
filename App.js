import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CalculatorScreen from './src/screens/CalculatorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calculator">
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: 'Calculadora de IMC' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Sobre'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}