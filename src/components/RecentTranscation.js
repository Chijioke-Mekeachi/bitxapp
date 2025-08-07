import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ExternButton from '../extern/ExternButton';

const RecentTransaction = () => {
  const navigation = useNavigation();

  const handleWithdrawPress = () => {
    navigation.navigate('WithdrawRequests');
  };

  const handleTransferPress = () => {
    navigation.navigate('BlurtTransferRequests');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Recent Transactions</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.btnHolder}>
          <ExternButton
            text="Withdraw Requests"
            onPress={handleWithdrawPress}
            icon="💰"
            containerStyle={styles.withdrawButton}
          />

          <ExternButton
            text="BLURT Transfers"
            onPress={handleTransferPress}
            icon="🔄"
            containerStyle={styles.transferButton}
          />
        </View>

        <Text style={styles.footerText}>View your recent transaction history</Text>
      </View>
    </View>
  );
};

export default RecentTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 32,
    color: '#FFD700',
    lineHeight: 32,
  },
  headerSpacer: {
    width: 32, // Matches back button space
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    flex: 1,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  btnHolder: {
    gap: 2,
    marginBottom: 40,
  },
  withdrawButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.2)',
    borderColor: '#8B0000',
  },
  transferButton: {
    backgroundColor: 'rgba(0, 100, 0, 0.2)',
    borderColor: '#006400',
  },
  footerText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 30,
    fontStyle: 'italic',
  },
});
