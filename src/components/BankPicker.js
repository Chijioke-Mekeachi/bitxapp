import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const PAYSTACK_SECRET_KEY = 'sk_test_xxxxxxx'; // Replace with your actual secret key

export default function BankPicker({ selectedBank, onSelectBank }) {
    const [banks, setBanks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBanks = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.paystack.co/bank', {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    },
                });
                const json = await response.json();
                if (json.status) {
                    // Filter to only Nigerian banks if needed or use all
                    setBanks(json.data);
                } else {
                    console.error('Failed to fetch banks:', json);
                }
            } catch (error) {
                console.error('Error fetching banks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanks();
    }, []);

    const handleSelect = (bank) => {
        onSelectBank(bank);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setModalVisible(true)}
                disabled={loading}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedBank ? selectedBank.name : loading ? 'Loading banks...' : 'Select Bank'}
                </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#ffcc00" style={{ margin: 20 }} />
                        ) : (
                            <FlatList
                                data={banks}
                                keyExtractor={(item, index) => item.code.toString() + '_' + index}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.bankItem}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={styles.bankText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />

                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    dropdownButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ffcc00',
        borderRadius: 8,
        backgroundColor: '#222',
    },
    dropdownButtonText: {
        color: '#ffcc00',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: '#121212',
        borderRadius: 12,
        maxHeight: '60%',
    },
    bankItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    bankText: {
        color: '#fff',
        fontSize: 16,
    },
});
