import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function DoubtHistoryScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) return;
      const { username } = JSON.parse(userDataString);
      const userKey = `doubtHistory:${username}`;

      const data = await AsyncStorage.getItem(userKey);
      const parsed = data ? JSON.parse(data) : [];
      parsed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setHistory(parsed);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const clearHistory = async () => {
    Alert.alert('Confirm', 'Clear all history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          const userDataString = await AsyncStorage.getItem('user');
          if (!userDataString) return;
          const { username } = JSON.parse(userDataString);
          await AsyncStorage.removeItem(`doubtHistory:${username}`);
          setHistory([]);
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doubt History</Text>
      {history.length === 0 ? (
        <Text style={styles.empty}>No doubts asked yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, index) => index.toString()}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DoubtAnswer', { doubt: item })}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.timestamp}>Asked on: {new Date(item.timestamp).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
              <Text style={styles.clearButtonText}>Clear History</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 40 ,backgroundColor: '#ADCBE3'},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: {
  marginBottom: 15,
  backgroundColor: '#E3F2FD', 
  borderRadius: 10,
  padding: 10,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
},

  image: { width: '100%', height: 200},
  timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
  empty: { marginTop: 50, textAlign: 'center', fontSize: 16, color: '#999' },
  clearButton: {
  marginTop: 15,
  padding: 15,
  backgroundColor: '#1976D2', 
  borderRadius: 10,
  alignItems: 'center',
},
clearButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},
title: { 
  fontSize: 24, 
  fontWeight: 'bold', 
  marginBottom: 10, 
},
empty: { 
  marginTop: 50, 
  textAlign: 'center', 
  fontSize: 16, 
  color: '#555' 
},

});