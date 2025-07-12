/** @format */

import { useState, useCallback } from 'react';
import { FormField, FieldValues } from '../types/FormTypes';

interface ValidationError {
  [key: string]: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError;
}

// Predefined validation functions
const validationFunctions: { [key: string]: (value: string) => boolean } = {
  isEmail: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  isPhone: (value: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  },
  isNumeric: (value: string): boolean => {
    return /^\d+$/.test(value);
  },
  isAlphabetic: (value: string): boolean => {
    return /^[a-zA-Z\s]+$/.test(value);
  },
  isAlphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9\s]+$/.test(value);
  },
  isURL: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  isPostalCode: (value: string): boolean => {
    // Basic postal code patterns for various countries
    const postalCodeRegex = /^[A-Z0-9\s\-]{3,10}$/i;
    return postalCodeRegex.test(value);
  },
  isNotEmpty: (value: string): boolean => {
    return value.trim().length > 0;
  },
};

export const useFormValidation = (fields: FormField[]) => {
  const [errors, setErrors] = useState<ValidationError>({});

  const validateField = useCallback(
    (field: FormField, value: string | string[]): string | null => {
      // Convert value to string for validation
      const stringValue = Array.isArray(value) ? value.join(',') : value;

      // Check if field is required and empty
      if (field.Required && (!stringValue || stringValue.trim() === '')) {
        return field.ValidationMessage || `${field.Text} is required`;
      }

      // Skip validation for empty non-required fields
      if (!field.Required && (!stringValue || stringValue.trim() === '')) {
        return null;
      }

      // Validate using regex if provided
      if (field.ValidationRegex) {
        try {
          const regex = new RegExp(field.ValidationRegex);
          if (!regex.test(stringValue)) {
            return field.ValidationMessage || `${field.Text} format is invalid`;
          }
        } catch (error) {
          console.warn(`Invalid regex pattern for field ${field.ID}:`, error);
          return 'Invalid validation pattern';
        }
      }

      // Validate using predefined function if provided
      if (field.ValidationFunction) {
        const validationFn =
          validationFunctions[
            field.ValidationFunction as keyof typeof validationFunctions
          ];
        if (validationFn) {
          if (!validationFn(stringValue)) {
            return field.ValidationMessage || `${field.Text} is invalid`;
          }
        } else {
          console.warn(
            `Validation function '${field.ValidationFunction}' not found`
          );
        }
      }

      // Additional validation for MaxLength
      if (field.MaxLength && stringValue.length > field.MaxLength) {
        return (
          field.ValidationMessage ||
          `${field.Text} must be no more than ${field.MaxLength} characters`
        );
      }

      return null;
    },
    []
  );

  const validateForm = useCallback(
    (values: FieldValues): ValidationResult => {
      const newErrors: ValidationError = {};
      let isValid = true;

      fields.forEach((field) => {
        const value = values[field.ID] || '';
        const error = validateField(field, value);

        if (error) {
          newErrors[field.ID] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return { isValid, errors: newErrors };
    },
    [fields, validateField]
  );

  const validateSingleField = useCallback(
    (field: FormField, value: string | string[]): string | null => {
      const error = validateField(field, value);

      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field.ID] = error;
        } else {
          delete newErrors[field.ID];
        }
        return newErrors;
      });

      return error;
    },
    [validateField]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldId: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldId]: '',
    }));
  }, []);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError,
    validationFunctions, // Export for custom usage
  };
};
