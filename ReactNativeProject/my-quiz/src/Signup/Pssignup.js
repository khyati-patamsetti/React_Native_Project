
import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, Text, Alert,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
 

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
    return regex.test(pwd);
  };

  const handleSignup = async () => {
    let isValid = true;
    setPasswordError('');
    setConfirmPasswordError('');

    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be 8+ characters, include uppercase, lowercase, number, and special character.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    try {
     
      const response = await axios.post('http://10.16.53.121:5000/auth/signup', {
        username,
        email,
        password,
      });
      
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Signup successful!\n check your email for verification via otp', [
  { text: 'OK', onPress: () => navigation.navigate('EmailOtp', { email, username }) }
],50);

      } else {
        Alert.alert('Signup Failed', response.data.message || 'Try again');
      }
    } catch (error) {
      console.log("Signup error:", error);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Something went wrong. Try again.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={styles.rootContainer} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0} 
    >
     
      <ScrollView
        contentContainerStyle={styles.contentContainer} 
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started!</Text>

        <TextInput
          placeholder="Username"
          placeholderTextColor="#888" 
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Email Address" 
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="#555" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
            <Icon name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#555" />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}



        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.loginRedirectContainer}>
          <Text style={styles.loginRedirectPromptText}>Already have an account?  </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginRedirectText}> Login</Text>
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
    backgroundColor: 'transparent', 
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: '5%', 
    alignSelf: 'flex-start', 
    fontSize: 12,
  },
  
  loginRedirectContainer: {
    marginTop: 20,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  loginRedirectPromptText: {
    color: '#5D6D7E', 
    fontSize: 14,
  },
  loginRedirectText: {
    color: '#2980B9', 
    fontWeight: 'bold', 
    fontSize: 14,
  },
});
















