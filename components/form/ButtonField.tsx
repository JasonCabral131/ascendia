/** @format */

import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FieldValues, FormField } from '@/types/FormTypes';

interface ButtonFieldProps {
  title: string;
  alertMessage: string;
  fieldValues: FieldValues;
  formFields: FormField[];
  validateForm: (values: FieldValues) => {
    isValid: boolean;
    errors: { [key: string]: string };
  };
  id: string;
  field: any;
}

const ButtonField = memo<ButtonFieldProps>(
  ({ title, alertMessage, fieldValues, formFields, validateForm, field }) => {
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

    const extractFieldIdsFromMessage = useCallback(
      (message: string): string[] => {
        const matches = message.match(/\$\{([^}]+)\}/g);
        if (!matches) return [];
        return matches.map((match) => match.slice(2, -1)); // Remove ${ and }
      },
      []
    );

    const checkFieldsValidation = useCallback(() => {
      const referencedFieldIds = extractFieldIdsFromMessage(alertMessage);
      const validationResult = validateForm(fieldValues);

      if (!validationResult.isValid) {
        // Check if any referenced fields have errors
        const referencedFieldErrors = referencedFieldIds
          .filter((fieldId) => validationResult.errors[fieldId])
          .map((fieldId) => {
            const field = formFields.find((f) => f.ID === fieldId);
            const fieldName = field?.Text || field?.Placeholder || fieldId;
            return `• ${fieldName}: ${validationResult.errors[fieldId]}`;
          });

        if (referencedFieldErrors.length > 0) {
          Alert.alert(
            'Validation Error',
            `Please fix the following errors before proceeding:\n\n${referencedFieldErrors.join(
              '\n'
            )}`,
            [{ text: 'OK' }]
          );
          return false;
        }
      }
      return true;
    }, [
      alertMessage,
      fieldValues,
      validateForm,
      formFields,
      extractFieldIdsFromMessage,
    ]);

    const handlePress = useCallback(() => {
      if (!checkFieldsValidation()) {
        return;
      }

      const parsedMessage = parseAlertMessage(alertMessage, fieldValues);
      Alert.alert('Message', parsedMessage);
    }, [alertMessage, fieldValues, parseAlertMessage, checkFieldsValidation]);
    const isShowButton = useMemo(() => {
      if (!field?.VisibleCondition) return true;
      switch (field?.VisibleCondition?.Operator) {
        case 'Equals':
          return (
            fieldValues[field?.VisibleCondition?.ID] ===
            field?.VisibleCondition?.Value
          );
        default:
          false;
      }
    }, [fieldValues]);
    console.log(
      'isShowButton',
      isShowButton,
      fieldValues[field?.VisibleCondition?.ID]
    );
    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].tint,
            display: isShowButton ? undefined : 'none',
          },
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
