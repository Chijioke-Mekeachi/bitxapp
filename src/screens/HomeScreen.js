import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#011227', '#04220a']}
          style={styles.header}
        >
          <View style={styles.navbar}>
           <Image source={require('../../assets/icon2.png')} style={{width:50,height:50}}/>
            <View style={styles.navButtons}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.navButtonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.navButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Hero Section */}
        <LinearGradient
          colors={['#04220a', '#011227']}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>Welcome to bitXchain</Text>
          <Text style={styles.heroSubtitle}>
            Discover amazing things, start here
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.sectionText}>
            We are an exchange platform that bridges the gap between traditional
            finance and blockchain technology, making crypto accessible to everyone.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Secure Trading</Text>
              <Text style={styles.featureText}>
                Trade with confidence using our secure platform
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Easy Wallet</Text>
              <Text style={styles.featureText}>
                Manage your crypto assets with our intuitive wallet
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Real-time Charts</Text>
              <Text style={styles.featureText}>
                Track market movements with live price charts
              </Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Blog Integration</Text>
              <Text style={styles.featureText}>
                Read and share crypto insights from the community
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Powered by bitX Group
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffcc00',
  },
  navButtonText: {
    color: '#ffcc00',
    fontWeight: 'bold',
    fontSize: 12,
  },
  hero: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  ctaButton: {
    backgroundColor: '#ffcc00',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
  },
});