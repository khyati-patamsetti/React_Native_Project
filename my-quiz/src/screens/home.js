import React, { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Linking,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
  Platform
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-native-paper';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [videoHistory, setVideoHistory] = useState([]);
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [videosList, setVideosList] = useState([]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setProfileVisible(false);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const { username } = JSON.parse(userData);
        setUsername(username);
      } 
    };
    getUserData();
  }, []);

  useFocusEffect(
  React.useCallback(() => {
    const loadHistory = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const { username } = JSON.parse(userData);
        const storageKey = `videoHistory_${username}`;
        const videoStored = await AsyncStorage.getItem(storageKey);
        setVideoHistory(videoStored ? JSON.parse(videoStored) : []);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    };

    loadHistory();

    return () => {
      setQuery('');
      fetchVideos('btech education');
    };
  }, [])
);


  useEffect(() => {
    fetchVideos('btech education');
  }, []);

  const fetchVideos = async (searchTerm) => {
  try {
    const educationalQuery = `${searchTerm} education tutorial lecture`;
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: educationalQuery,
          key: 'AIzaSyAXvDkkp9xKWoIkJX8f8sd2H-IDFk9Cq4Q', // consider hiding this key in production
          maxResults: 5,
          type: 'video',
          safeSearch: 'strict',
          relevanceLanguage: 'en',
          videoCategoryId: '27', // Education category
        },
      }
    );
    setVideosList(response.data.items);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
  }
};

  const openVideo = async (videoId, videoData) => {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const userData = await AsyncStorage.getItem('user');
    const { username } = JSON.parse(userData);

    const storageKey = `videoHistory_${username}`;
    const existingHistory = await AsyncStorage.getItem(storageKey);
    let history = existingHistory ? JSON.parse(existingHistory) : [];

    // Remove any duplicate
    history = history.filter((item) => item.id.videoId !== videoId);
    // Add the current video to the top
    history.unshift(videoData);

    const updatedHistory = history.slice(0, 10);

    // Save to AsyncStorage
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    // ✅ Update state immediately
    setVideoHistory(updatedHistory);

    // Open the video
    Linking.openURL(url);
  } catch (error) {
    console.error('Error saving video to history:', error);
  }
};


  return (
    <Provider>
      <SafeAreaView
        style={[
          styles.safeArea,
          { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
        ]}
      >
        <StatusBar backgroundColor="#ADCBE3" barStyle="dark-content" />

        <View style={styles.fixedHeader}>
          <Text style={styles.headerTitle}>Doubtify</Text>
          <TouchableOpacity onPress={() => setProfileVisible(true)}>
            <Icon name="person-circle-outline" size={35} color="#2E86C1" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.text}>Welcome, {username}!</Text>

          <View style={styles.askDoubtContainer}>
            <Text style={styles.askDoubtTitle}>Ask Doubt</Text>
          </View>

          <View style={styles.searchBar}>
            <Icon name="search-outline" size={20} color="#888" />
            <TextInput
              placeholder="Search for a topic (e.g., DBMS, OS)..."
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => query.trim() !== '' && fetchVideos(query)}
              returnKeyType="search"
            />
          </View>

          <FlatList
            data={videosList}
            keyExtractor={(item) => item.id.videoId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoCard}
                onPress={() => openVideo(item.id.videoId, item)}
              >
                <Image source={{ uri: item.snippet.thumbnails.high.url }} style={styles.thumbnail} />
                <View style={{ padding: 10 }}>
                  <Text style={styles.title} numberOfLines={2}>{item.snippet.title}</Text>
                  <Text style={styles.channel} numberOfLines={1}>{item.snippet.channelTitle}</Text>
                </View>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Video History</Text>
          </View>

          {videoHistory.length === 0 ? (
  <Text style={styles.noHistoryText}>No video history available.</Text>
) : (
  <FlatList
    data={videoHistory}
    keyExtractor={(item) => item.id.videoId}
    renderItem={({ item }) => (
      <TouchableOpacity style={styles.videoCard} onPress={() => openVideo(item.id.videoId, item)}>
        <Image source={{ uri: item.snippet.thumbnails.high.url }} style={styles.thumbnail} />
        <View style={{ padding: 10 }}>
          <Text style={styles.title} numberOfLines={2}>{item.snippet.title}</Text>
          <Text style={styles.channel} numberOfLines={1}>{item.snippet.channelTitle}</Text>
        </View>
      </TouchableOpacity>
    )}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 10 }}
  />
)}

        </ScrollView>

        <Modal
          visible={isProfileVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setProfileVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setProfileVisible(false)}
            style={styles.modalBackdrop}
          >
            <View style={styles.profilePanel}>
              <Text style={styles.profileName}>{username}</Text>
              <TouchableOpacity
                style={styles.profileItem}
                onPress={() => { setProfileVisible(false); navigation.navigate('DoubtHistory'); }}
              >
                <Text style={styles.profileItemText}>Doubt History</Text>
                <Icon name="chatbubble-ellipses-outline" size={20} color="#2E86C1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileItem} onPress={handleLogout}>
                <Text style={styles.profileItemText}>Logout</Text>
                <Icon name="exit-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ADCBE3',
  },
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#ADCBE3',
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 10, 
    paddingBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34495E',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  askDoubtContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  askDoubtTitle: {
    fontSize: 24,
    color: '#2E86C1',
    fontWeight: 'bold',
  },
  headerTitle:{
    fontSize: 28,
    color: '#2E86C1',
    fontWeight: 'bold',
  },
  noHistoryText: {
  fontSize: 16,
  color: 'black',
  textAlign: 'center',
  marginTop: 10,
},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#2E86C1',
    marginLeft: 10,
  },
  videoCard: {
    width: 345,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86C1',
    marginBottom: 4,
  },
  channel: {
    fontSize: 13,
    color: '#555',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profilePanel: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemText: {
    fontSize: 16,
  },
});