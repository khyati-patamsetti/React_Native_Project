import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert, SafeAreaView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatHistoryScreen() {
  const [historyPairs, setHistoryPairs] = useState([]);
  const [username, setUsername] = useState('');
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const flatListRef = useRef();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;
      const { username } = JSON.parse(userData);
      setUsername(username);
      const chat = await AsyncStorage.getItem(`chat_history_${username}`);
      if (chat) {
        const parsed = JSON.parse(chat);

        const pairs = [];
        for (let i = 0; i < parsed.length - 1; i++) {
          if (parsed[i].sender === 'user' && parsed[i + 1]?.sender === 'bot') {
            pairs.push({ question: parsed[i], answer: parsed[i + 1] });
          }
        }

        setHistoryPairs(pairs);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err.message);
    }
  };

  const deleteMessage = async (index) => {
    Alert.alert(
      'Delete this message?',
      'This will remove the selected question and answer from your history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updatedPairs = [...historyPairs];
              updatedPairs.splice(index, 1);
              setHistoryPairs(updatedPairs);
2
              const flat = updatedPairs.flatMap(pair => [pair.question, pair.answer]);
              await AsyncStorage.setItem(`chat_history_${username}`, JSON.stringify(flat));
            } catch (e) {
              console.error('Failed to delete message:', e.message);
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  const clearAllHistory = async () => {
    Alert.alert(
      'Clear All Chat History?',
      'Are you sure you want to delete all your chat messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`chat_history_${username}`);
              setHistoryPairs([]);
            } catch (e) {
              console.error('Failed to clear history:', e.message);
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  const toggleAnswer = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const renderFormattedText = (text) => {
    const codePattern = /```([\s\S]*?)```/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    let index = 0;

    while ((match = codePattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const normalText = text.substring(lastIndex, match.index);
        elements.push(...processBold(normalText, index++));
      }

      const code = match[1];
      elements.push(
        <View key={`code-${index++}`} style={styles.codeBlock}>
          <Text style={styles.codeText}>{code.trim()}</Text>
        </View>
      );

      lastIndex = codePattern.lastIndex;
    }

    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      elements.push(...processBold(remainingText, index++));
    }

    return elements;
  };

  const processBold = (text, baseIndex) => {
    const boldPattern = /\*([^*]+)\*/g;
    const parts = text.split(boldPattern);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <Text key={`bold-${baseIndex}-${i}`} style={styles.boldText}>
            {part}
          </Text>
        );
      } else {
        return (
          <Text key={`text-${baseIndex}-${i}`} style={styles.normalText}>
            {part}
          </Text>
        );
      }
    });
  };

  const renderItem = ({ item, index }) => {
    const showAnswer = expandedIndexes.includes(index);
    const time = new Date(item.question.timestamp).toLocaleString();

    return (
      <View style={styles.messageContainer}>
        <View style={styles.messageHeader}>
          <Text style={styles.sender}>{item.question.sender}</Text>
          <TouchableOpacity onPress={() => deleteMessage(index)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>{renderFormattedText(item.question.text)}</Text>
        <Text style={styles.time}>{time}</Text>

        <TouchableOpacity onPress={() => toggleAnswer(index)}>
          <Text style={styles.showAnswer}>
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </Text>
        </TouchableOpacity>

        {showAnswer && (
          <View style={styles.answerBox}>
            <Text style={styles.text}>{renderFormattedText(item.answer.text)}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={historyPairs}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.container}
        ListEmptyComponent={<Text style={styles.noHistory}>No chat history found.</Text>}
      />
      {historyPairs.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearAllHistory}>
          <Text style={styles.clearButtonText}>Clear All History</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#ADCBE3' },
  container: { padding: 10, paddingBottom: 80 },
  messageContainer: {
    backgroundColor: '#E8F6F3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1A5276',
  },
  deleteText: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  showAnswer: {
    color: '#2980B9',
    fontWeight: 'bold',
    marginTop: 6,
  },
  answerBox: {
    marginTop: 6,
    backgroundColor: '#F2F3F4',
    padding: 10,
    borderRadius: 6,
  },
  time: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  clearButton: {
    backgroundColor: '#E74C3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    margin: 15,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noHistory: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
    fontSize: 16,
  },
  codeBlock: {
    backgroundColor: '#D1D8E0',
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1A5276',
  },
  normalText: {
    color: '#000',
  },
});
