import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView,
  Keyboard, TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Clipboard from 'expo-clipboard'; 
import FeatherIcon from 'react-native-vector-icons/Feather';



export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(''); 
  const [username, setUsername] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const flatListRef = useRef();
  const navigation = useNavigation();

  const GEMINI_API_KEY = 'AIzaSyDO8SOh_oOYmofLQndIMFcCIF8RUQEIALI'; 
 
  useEffect(() => {
    loadUserAndHistory();
  }, []);
const loadUserAndHistory = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const { username } = JSON.parse(user);
      setUsername(username);

      const prevMessages = await AsyncStorage.getItem(`chat_history_${username}`);
      if (prevMessages) {
        console.log('Loaded existing chat history for history screen.');
      }

      setMessages([
        {
          id: 1,
          text: 'Hello! I am your AI assistant. Ask me anything.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  } catch (e) {
    console.error('Failed to load user or history:', e);
  }
};


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 0);
  };

  const TypingAnimation = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return <Text style={{ color: 'white' }}>typing{dots}</Text>;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const typingId = Date.now() + 1;
    setMessages((prev) => [...prev, {
      id: typingId,
      text: 'typing',
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }]);
    setBotTyping(true);

    const replyText = await fetchGeminiReply(input);

    setMessages((prev) => prev.filter((msg) => msg.id !== typingId));
    setBotTyping(false);

    const botMessage = {
      id: Date.now() + 2,
      text: replyText,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, botMessage]);

    await saveMessageToHistory(userMessage, botMessage);
  };


    const saveMessageToHistory = async (userMessage, botMessage) => {
    try {
      const existingHistory = JSON.parse(await AsyncStorage.getItem(`chat_history_${username}`)) || [];
      const updatedHistory = [...existingHistory, userMessage, botMessage];
      await AsyncStorage.setItem(`chat_history_${username}`, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save messages:', e.message);
    }
  };

  const fetchGeminiReply = async (text) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
          }),
        }
      );
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn’t understand.';
    } catch (error) {
      console.error('Error from Gemini:', error);
      return 'Something went wrong.';
    }
  };


  const copyToClipboard = async (text) => {
  try {
    await Clipboard.setStringAsync(text);
    alert('Copied to clipboard!');
  } catch (err) {
    console.error('Copy failed:', err);
  }
};

const formatMessage = (text) => {
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
        <TouchableOpacity
          style={styles.copyIcon}
          onPress={() => Clipboard.setStringAsync(code.trim())}
        >
          <FeatherIcon name="copy" size={18} color="#fff" />
        </TouchableOpacity>
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

const renderItem = ({ item }) => {
  const isTyping = item.text === 'typing';

  return (
    <View
      style={[
        styles.message,
        item.sender === 'user' ? styles.user : styles.bot
      ]}
    >
      {!isTyping && item.sender === 'bot' && (
<TouchableOpacity
  style={styles.copyIcon}
  onPress={() => Clipboard.setString(item.text)}
>
  <FeatherIcon name="copy" size={16} color="#fff" />
</TouchableOpacity>

      )}
      {isTyping ? (
        <TypingAnimation />
      ) : (
        <>{formatMessage(item.text)}</>
      )}
    </View>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChatHistoryScreen')}>
          <Icon name="menu-fold" size={24} color="#fff"  style={{marginTop:18}} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
              onContentSizeChange={scrollToBottom}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={{ fontWeight: 'bold', color: '#fff' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ADCBE3' },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  user: { backgroundColor: '#2E86C1', alignSelf: 'flex-end' },
  bot: { backgroundColor: '#2E86C1', alignSelf: 'flex-start' },
  inputContainer: {
    flexDirection: 'row',
    padding:10,
    // paddingVertical: 120,
    // paddingVertical:10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#ADCBE3',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#2E86C1',
    borderRadius: 20,
  },
  header: {
    height: 90,
    backgroundColor: '#2E86C1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:18
  },
  codeBlock: {
    backgroundColor: '#6E9CB9',
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  codeText: {
    color: '#eee',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  boldText: {
    fontWeight: 'bold',
    color: 'white',
  },
  normalText: {
    color: 'white',
  },
  copyButton: {
  marginTop: 6,
  alignSelf: 'flex-end',
  backgroundColor: '#1B4F72',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 8 ,
},
copyText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
copyIcon: {
  position: 'absolute',
  top: 10,
  right: 6,
  padding: -1,
},

});
