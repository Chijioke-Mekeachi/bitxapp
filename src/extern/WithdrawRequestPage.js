// WithdrawRequestsPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

const WithdrawRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return;
    setUserEmail(user.email);
    fetchMyRequestsFromAPI(user.email);
  };

  const fetchMyRequestsFromAPI = async (email) => {
    setLoading(true);
    try {
      const res = await fetch('https://bitapi-0m8c.onrender.com/api/get-my-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (res.ok) {
        setRequests(result.withdrawals || []);
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
        <Text style={styles.headerText}>🧾 Withdraw Requests</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchMyRequestsFromAPI(userEmail)}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00f0ff" />
      ) : requests.length === 0 ? (
        <Text style={styles.noRequestsText}>No withdraw requests found.</Text>
      ) : (
        <ScrollView>
          <Text style={styles.sectionTitle}>🏦 Withdraw Requests</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Account Name</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Bank</Text>
            <Text style={styles.headerCell}>Acct No.</Text>
            <Text style={styles.headerCell}>Status</Text>
          </View>

          {requests.map((req) => (
            <TouchableOpacity 
              key={req.id} 
              style={styles.tableRow}
              onPress={() => setSelectedRequest(req)}
            >
              <Text style={styles.cell}>{req.bank_username}</Text>
              <Text style={styles.cell}>₦{Number(req.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</Text>
              <Text style={styles.cell}>{req.bank_name}</Text>
              <Text style={styles.cell}>{req.account_number}</Text>
              <Text style={[styles.cell, styles.statusCell]}>{req.sent_or_pending}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Request Details</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Account Name:</Text> {selectedRequest.bank_username}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Amount:</Text> ₦{Number(selectedRequest.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Bank:</Text> {selectedRequest.bank_name}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Account Number:</Text> {selectedRequest.account_number}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Status:</Text> {selectedRequest.sent_or_pending}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Date:</Text> {new Date(selectedRequest.created_at).toLocaleString()}</Text>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedRequest(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  statusCell: {
    color: '#ffcc00',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#00f0ff',
  },
  detailText: {
    marginBottom: 10,
    fontSize: 16,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WithdrawRequestsPage;