import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(password);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters and include a number and a special character.'
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Password changed successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          style={styles.formContainer}
        >
          <Text style={styles.logo}>BitXchain</Text>
          
          <View style={styles.header}>
            <Text style={styles.title}>Change Password</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                placeholderTextColor="#ccc"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showPasswords}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="New Password"
                placeholderTextColor="#ccc"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPasswords}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirm New Password"
                placeholderTextColor="#ccc"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPasswords}
              />
              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowPasswords(!showPasswords)}
              >
                <Text style={styles.showButtonText}>
                  {showPasswords ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.passwordHint}>
            Password must be at least 8 characters and include a number and a special character.
          </Text>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <LinearGradient
              colors={['#ff0000', '#ffcc00']}
              style={styles.buttonGradient}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Changing...' : 'Change Password'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    padding: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffcc00',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffcc00',
    textTransform: 'uppercase',
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: '#ffcc00',
    borderRadius: 2,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffcc00',
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 60,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  showButton: {
    backgroundColor: '#ffcc00',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  showButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 14,
  },
  passwordHint: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
});