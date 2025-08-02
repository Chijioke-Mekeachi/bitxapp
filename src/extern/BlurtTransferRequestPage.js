// BlurtTransferRequestsPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
const BlurtTransferRequestsPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return;
    setUserEmail(user.email);
    fetchMyTransfersFromAPI(user.email);
  };

  const fetchMyTransfersFromAPI = async (email) => {
    setLoading(true);
    try {
      const res = await fetch('https://bitapi-0m8c.onrender.com/api/get-my-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (res.ok) {
        setTransfers(result.transfers || []);
      } else {
        console.error('API error:', result.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🔁 BLURT Transfer Requests</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchMyTransfersFromAPI(userEmail)}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00f0ff" />
      ) : transfers.length === 0 ? (
        <Text style={styles.noRequestsText}>No transfer requests found.</Text>
      ) : (
        <ScrollView>
          <Text style={styles.sectionTitle}>BLURT Transfer Requests</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Receiver</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Status</Text>
            <Text style={styles.headerCell}>Date</Text>
          </View>

          {transfers.map((tx) => (
            <View key={tx.id} style={styles.tableRow}>
              <Text style={styles.cell}>{tx.busername}</Text>
              <Text style={styles.cell}>{Number(tx.amount).toFixed(3)} BLURT</Text>
              <Text style={[styles.cell, tx.read ? styles.sentStatus : styles.pendingStatus]}>
                {tx.read ? '✅ Sent' : '⌛ Pending'}
              </Text>
              <Text style={styles.cell}>
                {new Date(tx.created_at).toLocaleString('en-NG', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00f0ff',
  },
  refreshButton: {
    backgroundColor: '#ffcc00',
    padding: 8,
    borderRadius: 4,
  },
  refreshText: {
    fontSize: 14,
  },
  noRequestsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 4,
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  sentStatus: {
    color: '#00ff99',
  },
  pendingStatus: {
    color: '#ffcc00',
  },
});

export default BlurtTransferRequestsPage;