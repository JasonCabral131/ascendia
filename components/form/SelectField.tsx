/** @format */

import React, { memo, useCallback, useState, useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Option } from '@/types/FormTypes';

interface SelectFieldProps {
  id: string;
  options: Option[];
  value: string | string[];
  multiple?: boolean;
  placeholder?: string;
  modalTitleSingle?: string;
  modalTitleMultiple?: string;
  onValueChange: (id: string, value: string | string[]) => void;
  error?: string;
  required?: boolean;
}

const SelectField = memo<SelectFieldProps>(
  ({
    id,
    options,
    value,
    multiple = false,
    placeholder = 'Select an option',
    modalTitleSingle = 'Select Option',
    modalTitleMultiple = 'Select Options',
    onValueChange,
    error,
    required = false,
  }) => {
    const colorScheme = useColorScheme();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const selectedValues = useMemo(() => {
      if (multiple) {
        return Array.isArray(value) ? value : [];
      }
      return typeof value === 'string' ? value : '';
    }, [value, multiple]);

    const displayText = useMemo(() => {
      if (multiple) {
        const selectedOptions = options.filter(
          (option) =>
            Array.isArray(selectedValues) &&
            selectedValues.includes(option.value)
        );
        return selectedOptions.length > 0
          ? selectedOptions.map((opt) => opt.label).join(', ')
          : placeholder;
      } else {
        const selectedOption = options.find(
          (option) => option.value === selectedValues
        );
        return selectedOption ? selectedOption.label : placeholder;
      }
    }, [options, selectedValues, multiple, placeholder]);

    const handleOptionPress = useCallback(
      (optionValue: string) => {
        if (multiple) {
          const currentValues = Array.isArray(selectedValues)
            ? selectedValues
            : [];
          const newValues = currentValues.includes(optionValue)
            ? currentValues.filter((v) => v !== optionValue)
            : [...currentValues, optionValue];
          onValueChange(id, newValues);
        } else {
          onValueChange(id, optionValue);
          setIsModalVisible(false);
        }
      },
      [id, multiple, selectedValues, onValueChange]
    );

    const handleDone = useCallback(() => {
      setIsModalVisible(false);
    }, []);

    const isSelected = useCallback(
      (optionValue: string) => {
        if (multiple) {
          return (
            Array.isArray(selectedValues) &&
            selectedValues.includes(optionValue)
          );
        }
        return selectedValues === optionValue;
      },
      [selectedValues, multiple]
    );

    const renderOption = useCallback(
      ({ item }: { item: Option }) => (
        <TouchableOpacity
          style={[styles.modalOption]}
          onPress={() => handleOptionPress(item.value)}
          activeOpacity={0.7}>
          <View style={styles.optionRow}>
            <Text
              style={[
                styles.optionText,
                isSelected(item.value) && {
                  color: Colors[colorScheme ?? 'light'].tint,
                  fontWeight: '600',
                },
              ]}>
              {item.label}
            </Text>
            {isSelected(item.value) && (
              <Text
                style={[
                  styles.checkmark,
                  { color: Colors[colorScheme ?? 'light'].tint },
                ]}>
                ✓
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ),
      [handleOptionPress, isSelected, colorScheme]
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            {
              borderColor: error
                ? Colors[colorScheme ?? 'light'].tint + '80'
                : Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            },
          ]}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.selectButtonText,
              displayText === placeholder && {
                color: Colors[colorScheme ?? 'light'].tabIconDefault,
              },
            ]}>
            {required && displayText === placeholder
              ? `${placeholder} *`
              : displayText}
          </Text>
          <Text
            style={[
              styles.arrow,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}>
            ▼
          </Text>
        </TouchableOpacity>

        {error && (
          <Text
            style={[
              styles.errorText,
              { color: Colors[colorScheme ?? 'light'].tint },
            ]}>
            {error}
          </Text>
        )}

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType='slide'
          onRequestClose={handleDone}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: Colors[colorScheme ?? 'light'].background },
              ]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {multiple ? modalTitleMultiple : modalTitleSingle}
                </Text>
                <TouchableOpacity onPress={handleDone}>
                  <Text
                    style={[
                      styles.doneButton,
                      { color: Colors[colorScheme ?? 'light'].tint },
                    ]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                renderItem={renderOption}
                keyExtractor={(item) => item.id}
                style={styles.optionsList}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

SelectField.displayName = 'SelectField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  selectButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectButtonText: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 14,
    marginLeft: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '75%',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  optionsList: {
    maxHeight: 350,
  },
  modalOption: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    minHeight: 54,
    justifyContent: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
    lineHeight: 20,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default SelectField;
