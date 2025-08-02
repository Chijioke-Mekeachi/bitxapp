import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React from 'react';

const ExternButton = ({ 
  text = "BLANK", 
  onPress, 
  disabled = false,
  loading = false,
  icon = null,
  textStyle = {},
  containerStyle = {}
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        disabled && styles.disabled,
        containerStyle
      ]} 
      activeOpacity={0.7} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFD700" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, textStyle]}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ExternButton;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    padding: 18,
    borderRadius: 12,
    alignSelf: 'center',
    backgroundColor: '#0f0f0f',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
    marginVertical: 12,
    minHeight: 56,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  disabled: {
    opacity: 0.6,
    borderColor: '#999',
  },
});