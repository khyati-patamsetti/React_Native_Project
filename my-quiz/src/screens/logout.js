import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.clear();
      Alert.alert("Logged out", "You have been logged out.");
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    };
    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Logging out...</Text>
    </View>
  );
}
