/** @format */

import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
}

const ErrorScreen = memo<ErrorScreenProps>(({ error, onRetry }) => {
  const colorScheme = useColorScheme();

  const handleRetry = useCallback(() => {
    onRetry?.();
  }, [onRetry]);

  return (
    <View style={styles.container}>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      {onRetry && (
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={handleRetry}
          activeOpacity={0.7}>
          <Text style={[styles.retryButtonText, { color: 'white' }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

ErrorScreen.displayName = 'ErrorScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorScreen;
