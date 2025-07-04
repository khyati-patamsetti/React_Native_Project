import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LeaderBoard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation();
 
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get('http://192.168.0.103:5000/score/leaderboard');
        setLeaders(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);
  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.card, index < 3 && styles.topThree]}>
      <Text style={styles.rank}>
        {getMedal(index) || `#${index + 1}`}
      </Text>
      <View style={styles.info}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.points}>{item.totalPoints} pts</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={28} color="#2E86C1" />
      </TouchableOpacity>

      <Text style={styles.title}>🏆 Leaderboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2E86C1" />
      ) : (
        <FlatList
          data={leaders}
          keyExtractor={(item, index) => `${item.username}_${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', 
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  topThree: {
    backgroundColor: '#0EA5E9',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FACC15',
    marginRight: 16,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  points: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});

export default LeaderBoard;
