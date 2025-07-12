/** @format */

import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Linking } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { InputElement } from '@/types/FormTypes';

interface TextFieldProps {
  id: string;
  placeholder: string;
  value: string;
  onChangeText: (id: string, value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftElement?: InputElement;
  rightElement?: InputElement;
  // Legacy props for backward compatibility
  leftIcon?: string;
  rightIcon?: string;
  rightIconAction?: 'toggle-secure' | 'clear' | 'custom';
  // Validation props
  error?: string;
  required?: boolean;
}

const TextField = memo<TextFieldProps>(
  ({
    id,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    autoCapitalize = 'words',
    secureTextEntry = false,
    multiline = false,
    numberOfLines = 1,
    maxLength,
    leftElement,
    rightElement,
    // Legacy props
    leftIcon,
    rightIcon,
    rightIconAction,
    // Validation props
    error,
    required = false,
  }) => {
    const colorScheme = useColorScheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);

    const handleTextChange = useCallback(
      (text: string) => {
        onChangeText(id, text);
      },
      [id, onChangeText]
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const handleRightElementPress = useCallback(async () => {
      const element = rightElement || {
        type: 'icon',
        content: rightIcon || '',
        action: rightIconAction,
      };

      if (element.action === 'toggle-secure') {
        setIsSecureTextVisible(!isSecureTextVisible);
      } else if (element.action === 'clear') {
        onChangeText(id, '');
      } else if (element.action === 'open-url' && element.type === 'url') {
        try {
          await Linking.openURL(element.content);
        } catch (error) {
          console.error('Failed to open URL:', error);
        }
      }
      // Custom actions can be handled by parent component
    }, [
      rightElement,
      rightIcon,
      rightIconAction,
      isSecureTextVisible,
      id,
      onChangeText,
    ]);

    const getLeftElement = useCallback(() => {
      if (leftElement) return leftElement;
      if (leftIcon) return { type: 'icon' as const, content: leftIcon };

      // Default icons based on keyboard type
      switch (keyboardType) {
        case 'email-address':
          return { type: 'icon' as const, content: 'mail-outline' };
        case 'phone-pad':
          return { type: 'icon' as const, content: 'call-outline' };
        case 'url':
          return { type: 'icon' as const, content: 'globe-outline' };
        case 'numeric':
          return { type: 'icon' as const, content: 'calculator-outline' };
        default:
          return { type: 'icon' as const, content: 'person-outline' };
      }
    }, [leftElement, leftIcon, keyboardType]);

    const getRightElement = useCallback(() => {
      if (rightElement) return rightElement;
      if (rightIcon)
        return {
          type: 'icon' as const,
          content: rightIcon,
          action: rightIconAction,
        };

      if (rightIconAction === 'toggle-secure') {
        return {
          type: 'icon' as const,
          content: isSecureTextVisible ? 'eye-off-outline' : 'eye-outline',
          action: 'toggle-secure' as const,
        };
      }
      if (rightIconAction === 'clear' && value.length > 0) {
        return {
          type: 'icon' as const,
          content: 'close-circle-outline',
          action: 'clear' as const,
        };
      }
      return null;
    }, [rightElement, rightIcon, rightIconAction, isSecureTextVisible, value]);

    const leftElementData = getLeftElement();
    const rightElementData = getRightElement();
    const shouldShowLeftElement =
      leftElementData && (!multiline || leftElementData.type !== 'icon');
    const shouldShowRightElement = rightElementData !== null;
    const actualSecureTextEntry = secureTextEntry && !isSecureTextVisible;

    const renderElement = useCallback(
      (element: InputElement, isLeft: boolean) => {
        const elementColor = isFocused
          ? Colors[colorScheme ?? 'light'].tint
          : Colors[colorScheme ?? 'light'].tabIconDefault;

        switch (element.type) {
          case 'icon':
            return (
              <Ionicons
                name={element.content as any}
                size={20}
                color={elementColor}
              />
            );

          case 'button':
            return (
              <Text
                style={[
                  styles.elementButton,
                  element.buttonStyle === 'primary' && styles.primaryButton,
                  element.buttonStyle === 'secondary' && styles.secondaryButton,
                  element.buttonStyle === 'link' && styles.linkButton,
                  { color: elementColor },
                ]}>
                {element.content}
              </Text>
            );

          case 'url':
            return (
              <Text
                style={[
                  styles.elementButton,
                  styles.linkButton,
                  { color: Colors[colorScheme ?? 'light'].tint },
                ]}>
                {element.content}
              </Text>
            );

          default:
            return null;
        }
      },
      [isFocused, colorScheme]
    );

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: error
                ? Colors[colorScheme ?? 'light'].tint + '80' // Red-ish color for error
                : isFocused
                ? Colors[colorScheme ?? 'light'].tint
                : Colors[colorScheme ?? 'light'].text + '30',
            },
            isFocused && styles.inputContainerFocused,
            error && styles.inputContainerError,
          ]}>
          {shouldShowLeftElement && leftElementData && (
            <View style={styles.leftElementContainer}>
              {renderElement(leftElementData, true)}
            </View>
          )}

          <TextInput
            style={[
              styles.textInput,
              multiline && styles.multilineInput,
              shouldShowLeftElement && styles.textInputWithLeftElement,
              shouldShowRightElement && styles.textInputWithRightElement,
              {
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: 'transparent',
              },
            ]}
            placeholder={required ? `${placeholder} *` : placeholder}
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={value}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            secureTextEntry={actualSecureTextEntry}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            maxLength={maxLength}
            autoCorrect={!secureTextEntry}
            returnKeyType={multiline ? 'default' : 'next'}
            blurOnSubmit={!multiline}
            textAlignVertical={multiline ? 'top' : 'center'}
          />

          {shouldShowRightElement && rightElementData && (
            <TouchableOpacity
              style={styles.rightElementContainer}
              onPress={handleRightElementPress}
              activeOpacity={0.7}>
              {renderElement(rightElementData, false)}
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text
            style={[
              styles.errorText,
              { color: Colors[colorScheme ?? 'light'].tint },
            ]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    minHeight: 50,
  },
  inputContainerFocused: {
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: 16,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftElementContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightElementContainer: {
    paddingRight: 16,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    padding: 16,
    paddingVertical: 16,
  },
  textInputWithLeftIcon: {
    paddingLeft: 8,
  },
  textInputWithRightIcon: {
    paddingRight: 8,
  },
  textInputWithLeftElement: {
    paddingLeft: 8,
  },
  textInputWithRightElement: {
    paddingRight: 8,
  },
  textInputFocused: {
    // Additional focused styles if needed
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 16,
    paddingBottom: 16,
    textAlignVertical: 'top',
  },
  elementButton: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryButton: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  linkButton: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  inputContainerError: {
    borderWidth: 2,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default TextField;
