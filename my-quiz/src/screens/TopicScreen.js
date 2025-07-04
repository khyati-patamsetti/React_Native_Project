import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { generateTopics } from '../config/gemini';

const TopicsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await generateTopics(category);
      setTopics(data);
      setLoading(false);
    };
    fetchTopics();
  }, [category]);

  if (loading) {
    return (
      <View style={[styles.page, styles.center]}>
        <ActivityIndicator size="large" color="#2E86C1" />
        <Text style={styles.loadingText}>Generating topics for "{category}"...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Text style={styles.header}>{category} TOPICS</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {topics.map((topic, index) => (
          <Pressable
            key={index}
            style={styles.topicBox}
            onPress={() => navigation.navigate('Questions', { selectedCategory: topic })}
          >
            <Text style={styles.topicText}>{topic}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ADCBE3',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E86C1',
    textAlign: 'center',
    paddingVertical: 40,
    backgroundColor: '#ADCBE3', 
    zIndex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  topicBox: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  topicText: {
    color: '#2E86C1',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500', 
  },
});

export default TopicsScreen;
