import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TouchableOpacity,Alert, BackHandler  } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Score = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    score = 0,
    results = [],
    selectedCategory = '',
    timeTaken = 0,
    username = 'Guest',
  } = route.params || {};

  const [actualUsername, setActualUsername] = useState(username || 'Guest');
  const correct = results.filter(r => r.isCorrect).length;
  const wrong = results.filter(r => r.selected && !r.isCorrect).length;
  const notAnswered = results.filter(r => r.selected === null).length;
  const circularRef = useRef(null);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const formattedTime = `${minutes}m ${seconds}s`; 
const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
   const loadUsernameAndSubmit = async () => {
  try { 
    let finalUsername = username;

    if (username === 'Guest') {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        finalUsername = parsed.username || 'Guest';
        setActualUsername(finalUsername);
      } 
    }
    const percentage = (score / 150) * 100;
    circularRef.current?.animate(percentage, 1000);
    await axios.post('http://192.168.0.103:5000/score/submit-score', {
      username: finalUsername,
      score,
      selectedCategory,
      correct,
      wrong, 
      notAnswered, 
      timeTaken,
    });
    const totalRes = await axios.get(`http://192.168.0.103:5000/score/total/${finalUsername}`);
    setTotalPoints(totalRes.data.totalPoints);

    console.log('Score submitted and total points fetched!');
  } catch (error) {
    console.error('Failed to submit score or fetch total points:', error.message);
  }
}; 
    loadUsernameAndSubmit();
  }, []);
useEffect(() => {
  const backAction = () => {
    Alert.alert(
      'Exit',
      'Do you want to exit to Home?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Home'),
        },
      ],
      { cancelable: true }
    );

    return true; 
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction
  );

  return () => backHandler.remove();
}, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('SelectSub', { selectedCategory })}
      >
        <Icon name="arrow-left" size={28} color="#2E86C1" />
      </TouchableOpacity>
  <Text style={styles.totalPoints}>Points: {totalPoints}</Text>

      <Text style={styles.title}>Quiz Summary</Text>

      <View style={styles.progressBox}>
        <AnimatedCircularProgress
          ref={circularRef}
          size={130}
          width={12}
          fill={0}
          tintColor="#2E86C1"
          backgroundColor="#D6EAF8"
          rotation={0}
          lineCap="round"
        >
          {() => <Text style={styles.scoreText}>{score}</Text>}
        </AnimatedCircularProgress>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="clock-outline" size={22} color="#5D6D7E" />
          <Text style={styles.label}>Time Taken:</Text>
          <Text style={styles.value}>{formattedTime}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Icon name="check-circle-outline" size={22} color="#27AE60" />
          <Text style={styles.label}>Correct Answers:</Text>
          <Text style={[styles.value, { color: '#27AE60' }]}>{correct}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Icon name="close-circle-outline" size={22} color="#E74C3C" />
          <Text style={styles.label}>Wrong Answers:</Text>
          <Text style={[styles.value, { color: '#E74C3C' }]}>{wrong}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Icon name="help-circle-outline" size={22} color="#F1C40F" />
          <Text style={styles.label}>Not Answered:</Text>
          <Text style={[styles.value, { color: '#F1C40F' }]}>{notAnswered}</Text>
        </View>
      </View>

      <Pressable
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate('Review', { results })}
      >
        <Text style={styles.buttonText}>Review Answers</Text>
      </Pressable>

      <Pressable
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('Questions', { selectedCategory })} 
      >
        <Text style={styles.buttonSecondaryText}>Play Again</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FBFF',
    paddingHorizontal: 24,
    paddingTop: 100,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
    padding: 8,
  },
  totalPoints: {
  position: 'absolute',
  top: 50,
  right: 24,
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2E86C1',
  backgroundColor: '#D6EAF8',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 10,
  overflow: 'hidden',
},
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E86C1',
    marginBottom: 20,
  },
  progressBox: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E86C1',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 17,
    color: '#34495E',
    flex: 1,
    marginLeft: 10,
  },
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2E86C1',
  },
  divider: {
    height: 1,
    backgroundColor: '#D5D8DC',
    marginVertical: 4,
  },
  buttonPrimary: {
    backgroundColor: '#2E86C1',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
    button3: {
    backgroundColor: '#2E86C1',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop:16,
    marginBottom: 16,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    borderWidth: 2,
    borderColor: '#2E86C1',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#2E86C1',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Score;
