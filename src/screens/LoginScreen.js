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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Login failed.');
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
            style={styles.formContainer}
          >
            <Text style={styles.logo}>BitXchain</Text>
            
            <View style={styles.header}>
              <Text style={styles.title}>Login</Text>
              <View style={styles.underline} />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#ccc"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showButtonText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>
                Don't have an account?{' '}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Signup')}
                >
                  Sign up
                </Text>
              </Text>
              <Text style={styles.linkText}>
                Forgot Password?{' '}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  Reset
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={['#ff0000', '#ffcc00']}
                style={styles.buttonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
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
  },
  scrollContainer: {
    flexGrow: 1,
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
    fontSize: 36,
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
    marginBottom: 30,
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
  linkContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  linkText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: '#00f0ff',
    fontWeight: 'bold',
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