import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './home';
import AskDoubtScreen from './ask';
import Icon from 'react-native-vector-icons/Ionicons';
import LeaderBoard from './LeaderBoard';
import SelectSub from './SelectSub';
import ChatStack from './ChatStack';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
   <Tab.Navigator
  screenOptions={{
    tabBarHideOnKeyboard: false, 
    headerShown: false,
    tabBarActiveTintColor: '#2E86C1',
    tabBarStyle: { height: 70, paddingBottom: 5, paddingTop: 5 },
  }}
>

      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Live Chat"
        component={ChatStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Ask Doubt"
        component={AskDoubtScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: 0,
                justifyContent: 'center',
                alignItems: 'center',
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#2E86C1',
                elevation: 5,
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
              }}
            >
              <Icon name="camera-outline" size={30} color="#fff" />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={SelectSub}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leader board"
        component={LeaderBoard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="school-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
