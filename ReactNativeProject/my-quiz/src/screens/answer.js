import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function DoubtAnswerScreen({ route }) {
  const { doubt } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📷 Your Doubt</Text>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: doubt.uri }} style={styles.image} />
      </View>
      <Text style={styles.timestamp}>
        Asked on: {new Date(doubt.timestamp).toLocaleString()}
      </Text>
      <Text style={styles.answerTitle}>✅ Solution</Text>
      <View style={styles.answerCard}>
        <Text style={styles.answerText}>
          {doubt.solution || '❌ Solution not available'}
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ADCBE3',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0D47A1',
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E3F2FD',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
  timestamp: {
    fontSize: 13,
    color: '#555',
    marginTop: 5,
    marginBottom: 20,
  },
  answerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2E7D32',
  },
  answerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});