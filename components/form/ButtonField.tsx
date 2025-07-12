/** @format */

import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FieldValues } from '@/types/FormTypes';

interface ButtonFieldProps {
  title: string;
  alertMessage: string;
  fieldValues: FieldValues;
}

const ButtonField = memo<ButtonFieldProps>(
  ({ title, alertMessage, fieldValues }) => {
    const colorScheme = useColorScheme();

    const parseAlertMessage = useCallback(
      (message: string, values: FieldValues): string => {
        return message.replace(/\$\{([^}]+)\}/g, (match, fieldId) => {
          const value = values[fieldId];
          if (Array.isArray(value)) {
            return value.join(', ');
          }
          return value || `[${fieldId}]`;
        });
      },
      []
    );

    const handlePress = useCallback(() => {
      const parsedMessage = parseAlertMessage(alertMessage, fieldValues);
      Alert.alert('Message', parsedMessage);
    }, [alertMessage, fieldValues, parseAlertMessage]);

    return (
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? 'light'].tint },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}>
        <Text style={[styles.buttonText, { color: 'white' }]}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

ButtonField.displayName = 'ButtonField';

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ButtonField;
