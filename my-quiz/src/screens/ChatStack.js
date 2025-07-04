import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatHistoryScreen from './chathistory';
import ChatScreen from './chat';
import { StatusBar } from 'react-native';
const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#000',
      }}
    >
      <Stack.Screen
        name="ChatMain"
        component={ChatScreen}
        options={{ headerTitle: 'Chat', headerBackTitleVisible: false,headerShown:false }}
      />
      <Stack.Screen
        name="ChatHistoryScreen"
        component={ChatHistoryScreen}
        options={{ headerTitle: 'Chat History' }}
      />
    </Stack.Navigator>
  ); 
}
