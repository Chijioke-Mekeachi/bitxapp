import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

// Import tab screens
import StatsScreen from '../components/StatsScreen';
import WalletScreen from '../components/WalletScreen';
import BlogScreen from '../components/BlogScreen';
import ProfileScreen from '../components/ProfileScreen';

const Tab = createBottomTabNavigator();

function DashboardHeader({ username, daysLeft }) {
  return (
    <LinearGradient
      colors={['#011227', '#04220a']}
      style={styles.header}
    >
      <Text style={styles.logo}>BitXchain</Text>
      <Text style={styles.welcomeText}>Hello {username}</Text>
      <Text style={styles.countdownText}>
        🚀 Testnet launches in {daysLeft} day{daysLeft !== 1 ? 's' : ''}!
      </Text>
    </LinearGradient>
  );
}

export default function DashboardScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();

        if (data) {
          setUsername(data.username);
        } else {
          setUsername('Anonymous');
        }
      } else {
        setUsername('Guest');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const launchDate = new Date('2025-08-20T00:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = launchDate - now;
      const days = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
      setDaysLeft(days);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader username={username} daysLeft={daysLeft} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#ffcc00',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#ffcc00',
          tabBarInactiveTintColor: '#ccc',
        }}
      >
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>📊</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Blog"
          component={BlogScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>📝</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>💰</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  countdownText: {
    fontSize: 16,
    color: '#00ffcc',
    textAlign: 'center',
  },
});