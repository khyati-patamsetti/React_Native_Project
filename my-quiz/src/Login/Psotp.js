
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import axios from 'axios';


export default function OtpVerificationScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [counter, setCounter] = useState(45);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (counter === 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];

    if (text.length === 6 && /^\d{6}$/.test(text)) {
      
      const splitOtp = text.split('');
      setOtp(splitOtp);
      inputsRef.current[5]?.focus();
    } else if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (/^\d$/.test(text)) {
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.103:5000/otp/verify', {
        email,
        otp: enteredOtp,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'OTP verified!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ResetPassword', { email }),
          },
        ]);
      } else {
        Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Verification Failed', error.response.data.message || 'Please try again.');
      } else {
        Alert.alert('Error', 'Network error. Please try again later.');
      }
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const response = await axios.post(`http://192.168.0.103:5000/otp/resend`, {
        email,
      });

      if (response.status === 200) {
        Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
        setOtp(new Array(6).fill(''));
        setCounter(45);
      } else {
        Alert.alert('Failed', 'Could not resend OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Try again.');
      console.error(error);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
                    inputsRef.current[index - 1]?.focus();
                  }
                }}
                keyboardType="numeric"
                maxLength={1}
                style={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              { opacity: otp.join('').length === 6 ? 1 : 0.6 },
            ]}
            onPress={handleVerify}
            disabled={otp.join('').length !== 6 || resending}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>

          <View style={styles.resendWrapper}>
            {counter > 0 ? (
              <Text style={styles.timerText}>Resend OTP in {counter}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOtp} disabled={resending}>
                <Text style={styles.resendText}>
                  {resending ? 'Resending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ADCBE3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#34495E',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#5D6D7E',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 40,
  },
  otpInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    width: 50,
    height: 60,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  verifyButton: {
    backgroundColor: '#2E86C1',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 10,
  },
  verifyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resendWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#2E86C1',
    fontWeight: 'bold',
    fontSize: 15,
  },
  timerText: {
    color: '#7f8c8d',
    fontSize: 15,
  },
});
