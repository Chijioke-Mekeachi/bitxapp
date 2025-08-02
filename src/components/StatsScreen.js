import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7');
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=blurt&vs_currencies=${selectedCurrency}`
        );
        const data = await response.json();
        const price = data.blurt?.[selectedCurrency];
        
        if (price != null) {
          setConvertedPrice(price);
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [selectedCurrency]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Blurt (BLURT) Price Tracker</Text>

        <View style={styles.selectSection}>
          <View style={styles.selectBox}>
            <Text style={styles.label}>Select Currency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCurrency}
                onValueChange={setSelectedCurrency}
                style={styles.picker}
                dropdownIconColor="#ffcc00"
              >
                <Picker.Item label="USD" value="usd" color="#fff" />
                <Picker.Item label="NGN" value="ngn" color="#fff" />
              </Picker>
            </View>
          </View>

          <View style={styles.selectBox}>
            <Text style={styles.label}>Select Time Range</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
                style={styles.picker}
                dropdownIconColor="#ffcc00"
              >
                <Picker.Item label="1 Day" value="1" color="#fff" />
                <Picker.Item label="7 Days" value="7" color="#fff" />
                <Picker.Item label="30 Days" value="30" color="#fff" />
                <Picker.Item label="90 Days" value="90" color="#fff" />
                <Picker.Item label="1 Year" value="365" color="#fff" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.priceDisplay}>
          <Text style={styles.priceTitle}>
            1 BLURT in {selectedCurrency.toUpperCase()}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#ffcc00" />
          ) : convertedPrice !== null ? (
            <Text style={styles.priceValue}>
              = {convertedPrice.toLocaleString(undefined, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}{' '}
              {selectedCurrency.toUpperCase()}
            </Text>
          ) : (
            <Text style={styles.errorText}>Price unavailable</Text>
          )}
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>
            📈 Chart functionality will be available in future updates
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Blurt</Text>
          <Text style={styles.infoText}>
            Blurt is a blockchain-based social media platform that rewards content creators
            and curators with cryptocurrency. It's designed to be fast, fee-less, and
            censorship-resistant.
          </Text>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  selectSection: {
    marginBottom: 30,
  },
  selectBox: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcc00',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#333',
  },
  priceDisplay: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffcc00',
  },
  priceTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  chartText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
});