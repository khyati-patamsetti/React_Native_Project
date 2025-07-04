import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, 
  KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.103:5000/auth/login', { email, password });
      console.log('Login response:', response.data);
      if (response.status === 200) {
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
        
          const { username } = response.data;
          if(username){
            await AsyncStorage.setItem('user', JSON.stringify({ username }));
          }
           navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Something went wrong. Try again.');
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };



  const handleSignupRedirect = () => {
    navigation.navigate('Signup');
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
      style={styles.rootContainer} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0} 
    >
     

      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Icon
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.or}>— OR —</Text>

        <View style={styles.signupContainer}>
          <Text style={styles.signupPromptText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignupRedirect}>
            <Text style={styles.signupText}> Sign Up!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  
  rootContainer: { 
    flex: 1,
    backgroundColor: '#ADCBE3', 
  },
  contentContainer: { 
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34495E', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#5D6D7E', 
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC3C7', 
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, 
  },
  passwordContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end', 
    marginRight: '5%', 
    marginBottom: 30,
  },
  link: {
    color: '#2980B9', 
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    width: '90%',
    backgroundColor: '#2E86C1', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  or: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#7F8C8D', 
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupPromptText: {
    color: '#5D6D7E',
    fontSize: 14,
  },
  signupText: {
    color: '#2980B9', 
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 