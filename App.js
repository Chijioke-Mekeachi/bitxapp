import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import 'react-native-url-polyfill/auto';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import RecentTranscation from './src/components/RecentTranscation';
import WithdrawRequestsPage from './src/extern/WithdrawRequestPage';
import BlurtTransferRequestsPage from './src/extern/BlurtTransferRequestPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#121212" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
            shadowColor: '#ffcc00',
            shadowOpacity: 0.3,
            elevation: 5,
          },
          headerTintColor: '#ffcc00',
          headerTitleStyle: {
            fontWeight: 'bold',
            textShadowColor: 'rgba(255, 204, 0, 0.3)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          },
          cardStyle: {
            backgroundColor: '#1a1a1a'
          }
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{ title: 'Reset Password' }}
        />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePasswordScreen}
          options={{ title: 'Change Password' }}
        />
        {/* Add new transaction-related screens */}
        <Stack.Screen 
          name="RecentTransactions" 
          component={RecentTranscation}
          options={{ 
            title: 'Transactions',
            headerLeft: null // Remove back button if you don't want to go back from here
          }}
        />
        <Stack.Screen 
          name="WithdrawRequests" 
          component={WithdrawRequestsPage}
          options={{ 
            title: 'Withdraw Requests',
            headerBackTitleVisible: false
          }}
        />
        <Stack.Screen 
          name="BlurtTransferRequests" 
          component={BlurtTransferRequestsPage}
          options={{ 
            title: 'BLURT Transfers',
            headerBackTitleVisible: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}