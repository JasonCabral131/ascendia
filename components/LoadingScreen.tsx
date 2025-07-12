/** @format */

import React, { memo } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = memo<LoadingScreenProps>(({ message = 'Loading...' }) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size='large'
        color={Colors[colorScheme ?? 'light'].tint}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingScreen;
