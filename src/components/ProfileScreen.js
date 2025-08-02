import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserData(data);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'profile' && styles.activeTab]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'settings' && styles.activeTab]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.profileInfo}>
              <View style={styles.profileItem}>
                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{userData?.username || '...'}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userData?.email || '...'}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.label}>Blurt Username:</Text>
                <Text style={styles.value}>{userData?.busername || '...'}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.label}>Bio:</Text>
                <Text style={styles.value}>Crypto enthusiast and trader.</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.label}>Member Since:</Text>
                <Text style={styles.value}>
                  {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : '...'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsSection}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <Text style={styles.settingText}>🔒 Change Password</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>🔔 Notifications</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>🌙 Dark Mode</Text>
                <Text style={styles.settingValue}>Enabled</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>🔐 Security</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>❓ Help & Support</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>📋 Terms of Service</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>🔒 Privacy Policy</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.settingItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <Text style={[styles.settingText, styles.logoutText]}>🚪 Logout</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#00ff00',
  },
  tabText: {
    color: '#ff5100',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#000',
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  label: {
    color: '#ffcc00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  settingsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
  settingValue: {
    color: '#ccc',
    fontSize: 14,
  },
  arrow: {
    color: '#ffcc00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff4444',
  },
});