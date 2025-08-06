import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';

// Replace with your own supabase instance or auth mechanism
import { supabase } from '../lib/supabase'; 
import { PAYSTACK_SECRET_KEY } from '@env';
export default function WithdrawModal({
  showWithdrawModal,
  setShowWithdrawModal,
  onWithdraw,
  profile, // pass user profile object {email, id, ...}
  fetchUserProfile, // function to refresh profile after withdraw
}) {
  const [withdrawMethod, setWithdrawMethod] = useState('naira'); // 'naira' or 'usdt'
  const [amount, setAmount] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  const [accountNameError, setAccountNameError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  

  // Fetch list of banks from Paystack
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await fetch(
        'https://api.paystack.co/bank?country=nigeria&currency=NGN',
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, // your Paystack secret key here
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.status && result.data) {
        setBanks(result.data);
      } else {
        Alert.alert('Error', 'Failed to load banks');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // Automatically resolve account name when account number is 10 digits and bank selected
  useEffect(() => {
    if (
      withdrawMethod === 'naira' &&
      withdrawAccountNumber.length === 10 &&
      selectedBank
    ) {
      resolveAccountName(withdrawAccountNumber, selectedBank.code);
    } else {
      setResolvedAccountName('');
      setAccountNameError('');
    }
  }, [withdrawAccountNumber, selectedBank, withdrawMethod]);

  const resolveAccountName = async (accountNumber, bankCode) => {
    setLoading(true);
    setAccountNameError('');
    try {
      const response = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.status && data.data && data.data.account_name) {
        setResolvedAccountName(data.data.account_name);
      } else {
        setAccountNameError(data.message || 'Unable to resolve account name');
      }
    } catch (error) {
      console.error('Account resolve error:', error);
      setAccountNameError('Error resolving account name');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Enter a valid amount.');
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (
      (withdrawMethod === 'naira' && parsedAmount < 500) ||
      (withdrawMethod === 'usdt' && parsedAmount < 5)
    ) {
      Alert.alert(
        'Error',
        withdrawMethod === 'naira'
          ? 'Minimum withdrawal is ₦500'
          : 'Minimum USDT withdrawal is $5'
      );
      return;
    }

    // Check user auth via supabase (or your auth system)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    if (withdrawMethod === 'naira') {
      if (!selectedBank || !withdrawAccountNumber || !resolvedAccountName) {
        Alert.alert('Error', 'Fill in all valid bank details.');
        return;
      }
    }

    if (withdrawMethod === 'usdt') {
      if (!walletAddress) {
        Alert.alert('Error', 'Enter your USDT wallet address.');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        email: profile.email,
        amount: parsedAmount,
        method: withdrawMethod,
        user_id: profile.id,
      };

      if (withdrawMethod === 'naira') {
        payload.bank = selectedBank.name;
        payload.accountName = resolvedAccountName;
        payload.accountNumber = withdrawAccountNumber;
      }

      if (withdrawMethod === 'usdt') {
        payload.walletAddress = walletAddress;
      }

      const response = await fetch(
        'https://bitapi-0m8c.onrender.com/api/withdraw',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Withdrawal failed.');
      }

      Alert.alert('Success', result.message || 'Withdrawal successful!');
      setAmount('');
      setWalletAddress('');
      setSelectedBank(null);
      setWithdrawAccountNumber('');
      setResolvedAccountName('');
      setAccountNameError('');
      setShowWithdrawModal(false);
      fetchUserProfile?.();
    } catch (error) {
      console.error('Withdraw error:', error);
      Alert.alert('Error', error.message || 'Withdrawal error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={showWithdrawModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>WITHDRAW</Text>

          {/* Method Selector */}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 15,
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor: withdrawMethod === 'naira' ? '#ffcc00' : '#333',
                  marginRight: 10,
                },
              ]}
              onPress={() => setWithdrawMethod('naira')}
            >
              <Text style={{ color: '#000' }}>NAIRA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: withdrawMethod === 'usdt' ? '#00f0ff' : '#333' },
              ]}
              onPress={() => setWithdrawMethod('usdt')}
            >
              <Text style={{ color: '#000' }}>USDT</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <TextInput
            style={styles.modalInput}
            placeholder="Enter amount"
            placeholderTextColor="#ccc"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          {/* Naira withdrawal inputs */}
          {withdrawMethod === 'naira' && (
            <>
              <Text style={{ marginBottom: 5, color: '#aaa' }}>Select Bank</Text>

              <ScrollView style={styles.bankListContainer}>
                {banks.length === 0 ? (
                  <ActivityIndicator color="#00f" />
                ) : (
                  banks.map((bank, index) => (
                    <TouchableOpacity
                      key={`${bank.code}-${index}`}
                      onPress={() => setSelectedBank(bank)}
                      style={{
                        padding: 10,
                        backgroundColor:
                          selectedBank?.code === bank.code ? '#ffcc00' : '#444',
                        marginBottom: 5,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: selectedBank?.code === bank.code ? '#000' : '#eee',
                        }}
                      >
                        {bank.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              <TextInput
                style={styles.modalInput}
                placeholder="Account Number"
                placeholderTextColor="#ccc"
                value={withdrawAccountNumber}
                onChangeText={setWithdrawAccountNumber}
                keyboardType="number-pad"
                maxLength={10}
              />

              {/* Show loading or account name or error */}
              {loading ? (
                <ActivityIndicator size="small" color="#00f" style={{ marginTop: 10 }} />
              ) : resolvedAccountName ? (
                <Text style={{ color: '#0f0', marginTop: 10 }}>
                  Account Name: {resolvedAccountName}
                </Text>
              ) : accountNameError ? (
                <Text style={{ color: '#f00', marginTop: 10 }}>{accountNameError}</Text>
              ) : null}
            </>
          )}

          {/* USDT withdrawal input */}
          {withdrawMethod === 'usdt' && (
            <TextInput
              style={styles.modalInput}
              placeholder="USDT Wallet Address"
              placeholderTextColor="#ccc"
              value={walletAddress}
              onChangeText={setWalletAddress}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleWithdraw}
              disabled={loading}
            >
              <Text style={styles.modalButtonText}>
                {loading ? 'Processing...' : 'Withdraw'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowWithdrawModal(false)}
              disabled={loading}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // lighter overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#eee',
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#444',
    borderRadius: 5,
    padding: 10,
    color: '#eee',
    marginBottom: 10,
  },
  bankListContainer: {
    maxHeight: 180,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#555',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#900',
  },
  modalButtonText: {
    color: '#eee',
    fontWeight: 'bold',
  },
};
