/** @format */

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import DynamicForm from '@/components/form/DynamicForm';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/ErrorScreen';
import { useFormConfig } from '@/hooks/useFormConfig';

const TabOneScreen = memo(() => {
  const { config, loading, error, refetch } = useFormConfig();

  if (loading) {
    return <LoadingScreen message='Loading form configuration...' />;
  }

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onRetry={refetch}
      />
    );
  }

  if (!config) {
    return (
      <ErrorScreen
        error='No configuration found'
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      <DynamicForm config={config} />
    </View>
  );
});

TabOneScreen.displayName = 'TabOneScreen';

export default TabOneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
