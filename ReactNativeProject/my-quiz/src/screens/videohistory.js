import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function VideoHistoryScreen() {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

useEffect(() => {
  const loadHistory = async () => {
    const userData = await AsyncStorage.getItem('user');
    const { username } = JSON.parse(userData);
    const storageKey = `videoHistory_${username}`;
    const data = await AsyncStorage.getItem(storageKey);
    setHistory(data ? JSON.parse(data) : []);
  };
  loadHistory();
}, []);


  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.videoId}
renderItem={({ item }) => (
  <TouchableOpacity
    onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${item.id.videoId}`)}
    style={styles.videoCard}
  >
    <Image source={{ uri: item.snippet.thumbnails.high.url }} style={styles.thumbnail} />
    <View style={{ padding: 10 }}>
      <Text style={styles.title} numberOfLines={2}>{item.snippet.title}</Text>
      <Text style={styles.channel} numberOfLines={1}>{item.snippet.channelTitle}</Text>
    </View>
  </TouchableOpacity>
)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  thumbnail: { width: '100%', height: 200 },
  title: { fontSize: 16, fontWeight: 'bold' },
  channel: { fontSize: 14, color: '#555' },
});