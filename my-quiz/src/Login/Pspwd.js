import React, { useState } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.103:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        Alert.alert('Success', 'Password changed successfully.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Failed', data.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Something went wrong while changing password.');
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
        <Text style={styles.title}>Reset Password</Text>

        <TextInput
          placeholder="Email"
          style={[styles.input, { backgroundColor: '#ecf0f1', color: '#7f8c8d'  }]}
          value={email}
          editable={false}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="New Password"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
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
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ADCBE3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#34495E',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  button: {
    backgroundColor: '#2E86C1',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
