import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import axios from 'axios';


export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://10.16.53.121:5000/auth/register', { email });
      if (response.status === 200 || response.status === 201) {
        Alert.alert('OTP Sent', `An OTP has been sent to ${email}`, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OtpVerification', { email }),
          },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your registered email to receive a verification code.</Text>

        <TextInput
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
  flex: 1,
  backgroundColor: '#ADCBE3', 
},
flex:{
  flex:1,
},
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    backgroundColor: '#ADCBE3',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#34495E',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5D6D7E',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#2E86C1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#2E86C1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
