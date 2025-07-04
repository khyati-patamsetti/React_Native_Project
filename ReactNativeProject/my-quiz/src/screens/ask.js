import React, { useState, useEffect, useRef} from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView, Modal, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { useNavigation , useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function AskDoubtScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(true);
  const navigation = useNavigation();
  useFocusEffect(
  React.useCallback(() => {
    setShowPickerModal(true);
    setImageUri(null);
    setImageBase64(null);
    setSolution('');
    return () => {};
  }, [])
);
useEffect(() => {
  const unsubscribe = navigation.addListener('tabPress', () => {
    setShowPickerModal(true);
    setImageUri(null);
    setImageBase64(null);
    setSolution('');
  });

  return unsubscribe;
}, [navigation]);
  const GEMINI_API_KEY = 'AIzaSyBQhM8j6eUsRE72OeDnWE-MZbgZQXC9Drg';

  const openCamera = async () => {
    setShowPickerModal(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera permission is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
    });

    if (!result.assets || result.assets.length === 0) {
  setShowPickerModal(true); 
  return;
}

  const asset = result.assets[0];
  const fileName = `doubt_${Date.now()}.jpg`;
  const newPath = FileSystem.documentDirectory + fileName;

  await FileSystem.copyAsync({
    from: asset.uri,
    to: newPath,
  });

  setImageUri(newPath);
  setImageBase64(asset.base64);
};

  const openGallery = async () => {
    setShowPickerModal(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery permission is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
    });

    if (!result.assets || result.assets.length === 0) {
  setShowPickerModal(true); 
  return;
}
      const asset = result.assets[0];
const fileName = `doubt_${Date.now()}.jpg`;
const newPath = FileSystem.documentDirectory + fileName;

await FileSystem.copyAsync({
  from: asset.uri,
  to: newPath,
});

setImageUri(newPath);
setImageBase64(asset.base64);

     
  }

const findSolution = async () => {
  setLoading(true);
  setSolution('');

  try {
    if (!imageBase64) {
      Alert.alert('Error', 'Image not available.');
      setLoading(false);
      return;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64,
                  }
                },
                {
                  text: "Solve the question in the image. First provide the final answer in the format: Answer: <your answer>. Then explain the solution step by step."
                }
              ]
            }
          ]
        })
      }
    );

    const json = await response.json();
    console.log('Gemini Response:', JSON.stringify(json, null, 2));
    const responseText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    const finalSolution = responseText || "Couldn't generate a solution.";
    setSolution(finalSolution);
    await saveToHistory(finalSolution);
  } catch (error) {
    console.error('Gemini Error:', error);
    Alert.alert('Error', 'Could not get the solution.');
  }

  setLoading(false);
};

const saveToHistory = async (finalSolution) => {
  const historyItem = {
    uri: imageUri,
    timestamp: new Date().toISOString(),
    solution: finalSolution || "Solution not available"
  };
  try {
    const userDataString = await AsyncStorage.getItem('user');
    if (!userDataString) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    const { username } = JSON.parse(userDataString);
    const userKey = `doubtHistory:${username}`;

    const existing = await AsyncStorage.getItem(userKey);
    const items = existing ? JSON.parse(existing) : [];
    items.unshift(historyItem); 
    await AsyncStorage.setItem(userKey, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving history:', e);
  }

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: `doubt_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
      formData.append('timestamp', historyItem.timestamp);
      formData.append('solution', finalSolution);
  
      await axios.post('https://your-backend-url.com/api/doubts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err) {
      console.error('Failed to upload to backend:', err.message);
    }
  };


  return (
    <View style={styles.container}>
      <Modal visible={showPickerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Source</Text>

            <TouchableOpacity style={styles.button} onPress={openCamera}>
              <Text style={styles.buttonText}>📷 Open Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openGallery}>
              <Text style={styles.buttonText}>🖼 Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                navigation.navigate('Home', { screen: 'HomeScreen' });
              }}
            >
              <Text style={styles.cancelText}>🔙 Cancel / Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.button} onPress={findSolution}>
            <Text style={styles.buttonText}>Find Solution</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <ActivityIndicator size="large" color="#2E86C1" style={{ marginTop: 20 }} />
      )}

      {solution !== '' && (
        <ScrollView style={styles.solutionContainer}>
          <Text style={styles.solutionTitle}>Solution:</Text>
          <Text style={styles.solutionText}>{solution}</Text>
        </ScrollView>
      )}
      {/* {(imageUri || solution) && (
  <TouchableOpacity
    style={[styles.button, { marginTop: 10 }]}
    onPress={() => {
      setImageUri(null);
      setImageBase64(null);
      setSolution('');
      setShowPickerModal(true); // Open the modal again
    }}
  >
    <Text style={styles.buttonText}>🆕 Upload Another Image</Text>
  </TouchableOpacity>
)} */}

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADCBE3',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E86C1',
  },
  button: {
    backgroundColor: '#2E86C1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#888',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  cancelText: {
    color: 'white',
    textAlign: 'center',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  solutionContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    maxHeight: 400,
  },
  solutionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#2E86C1',
  },
  solutionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
});
