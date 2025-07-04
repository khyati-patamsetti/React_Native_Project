import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import axios from 'axios';

export default function EmailOtpScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      const res = await axios.post('http://192.168.0.103:5000/auth/verify-email-otp', {
        email,
        otp,
      });

      if (res.status === 200) {
        Alert.alert('Success', 'Email verified successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await axios.post('http://192.168.0.103:5000/auth/resend-email-otp', { email });

      if (res.status === 200) {
        Alert.alert('Success', 'OTP resent to your email');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>
          <Text style={styles.otpInfo}>OTP is valid for 5 minutes.</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            keyboardType="numeric"
            value={otp}
            maxLength={6}
            onChangeText={setOtp}
          />

          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resendButton, resendLoading && { opacity: 0.6 }]}
            onPress={handleResendOtp}
            disabled={resendLoading}
          >
            <Text style={styles.resendText}>
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ADCBE3',
  },
  container: {
    flex: 1,
    backgroundColor: '#ADCBE3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5D6D7E',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D5D8DC',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  otpInfo: {
    fontSize: 14,
    color: '#5D6D7E',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2980B9',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    padding: 10,
  },
  resendText: {
    color: '#2980B9',
    fontSize: 16,
    fontWeight: '500',
  },
});
