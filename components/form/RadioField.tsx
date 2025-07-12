/** @format */

import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Option } from '@/types/FormTypes';

interface RadioFieldProps {
  id: string;
  options: Option[];
  value: string;
  onValueChange: (id: string, value: string) => void;
}

const RadioField = memo<RadioFieldProps>(
  ({ id, options, value, onValueChange }) => {
    const colorScheme = useColorScheme();

    const handleOptionPress = useCallback(
      (optionValue: string) => {
        onValueChange(id, optionValue);
      },
      [id, onValueChange]
    );

    return (
      <View style={styles.container}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.radioOption,
                isSelected && {
                  borderColor: Colors[colorScheme ?? 'light'].tint,
                },
              ]}
              onPress={() => handleOptionPress(option.value)}
              activeOpacity={0.7}>
              <View style={styles.radioRow}>
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor: isSelected
                        ? Colors[colorScheme ?? 'light'].tint
                        : Colors[colorScheme ?? 'light'].text + '40',
                    },
                  ]}>
                  {isSelected && (
                    <View
                      style={[
                        styles.radioButtonInner,
                        {
                          backgroundColor: Colors[colorScheme ?? 'light'].tint,
                        },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.radioLabel,
                    {
                      color: isSelected
                        ? Colors[colorScheme ?? 'light'].tint
                        : Colors[colorScheme ?? 'light'].text,
                    },
                  ]}>
                  {option.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
);

RadioField.displayName = 'RadioField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  radioOption: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioLabel: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
});

export default RadioField;
