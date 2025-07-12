/** @format */

import React, { memo, useCallback, useMemo, useRef } from 'react';
import { FormField, FieldValues } from '@/types/FormTypes';
import HeaderField from './HeaderField';
import TextField from './TextField';
import ButtonField from './ButtonField';
import RadioField from './RadioField';
import SelectField from './SelectField';

interface FormFieldRendererProps {
  field: FormField;
  fieldValues: FieldValues;
  onFieldChange: (id: string, value: string | string[]) => void;
  error?: string;
  formFields: FormField[];
  validateForm: (values: FieldValues) => {
    isValid: boolean;
    errors: { [key: string]: string };
  };
}

const FormFieldRenderer = memo<FormFieldRendererProps>(
  ({ field, fieldValues, onFieldChange, error, formFields, validateForm }) => {
    const fieldValueRef = useRef<string | string[]>(
      field.ID ? fieldValues[field.ID] || (field.Multiple ? [] : '') : ''
    );

    const handleFieldChange = useCallback(
      (id: string, value: string | string[]) => {
        fieldValueRef.current = value;
        onFieldChange(id, value);
      },
      [onFieldChange]
    );

    const renderedField = useMemo(() => {
      switch (field.Type) {
        case 'H1':
          return <HeaderField text={field.Text || ''} />;

        case 'Text':
          if (!field.ID) return null;
          const textValue = fieldValues[field.ID];
          return (
            <TextField
              id={field.ID}
              placeholder={field.Placeholder || ''}
              value={typeof textValue === 'string' ? textValue : ''}
              onChangeText={handleFieldChange}
              keyboardType={field.KeyboardType}
              autoCapitalize={field.AutoCapitalize}
              secureTextEntry={field.SecureTextEntry}
              multiline={field.Multiline}
              numberOfLines={field.NumberOfLines}
              maxLength={field.MaxLength}
              leftElement={field.LeftElement}
              rightElement={field.RightElement}
              leftIcon={field.LeftIcon}
              rightIcon={field.RightIcon}
              rightIconAction={field.RightIconAction}
              error={error}
              required={field.Required}
            />
          );

        case 'Radio':
          if (!field.ID || !field.Options) return null;
          const radioValue = fieldValues[field.ID];
          return (
            <RadioField
              id={field.ID}
              options={field.Options}
              value={typeof radioValue === 'string' ? radioValue : ''}
              onValueChange={handleFieldChange}
            />
          );

        case 'Select':
          if (!field.ID || !field.Options) return null;
          const selectValue = fieldValues[field.ID];
          return (
            <SelectField
              id={field.ID}
              options={field.Options}
              value={selectValue || (field.Multiple ? [] : '')}
              multiple={field.Multiple}
              placeholder={field.Placeholder}
              modalTitleSingle={field.ModalTitleSingle}
              modalTitleMultiple={field.ModalTitleMultiple}
              onValueChange={handleFieldChange}
              error={error}
              required={field.Required}
            />
          );

        case 'Button':
          return (
            <ButtonField
              title={field.Title || ''}
              alertMessage={field.AlertMessage || ''}
              fieldValues={fieldValues}
              formFields={formFields}
              validateForm={validateForm}
            />
          );

        default:
          return null;
      }
    }, [field, fieldValues, handleFieldChange]);

    return renderedField;
  }
);

FormFieldRenderer.displayName = 'FormFieldRenderer';

export default FormFieldRenderer;
