/** @format */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FormConfig, FieldValues } from '@/types/FormTypes';
import FormFieldRenderer from './FormFieldRenderer';
import { useFormValidation } from '@/hooks/useFormValidation';

interface DynamicFormProps {
  config: FormConfig;
}

const DynamicForm = memo<DynamicFormProps>(({ config }) => {
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const { errors, validateSingleField, validateForm } = useFormValidation(
    config.Fields
  );

  const handleFieldChange = useCallback(
    (id: string, value: string | string[]) => {
      setFieldValues((prev) => ({
        ...prev,
        [id]: value,
      }));

      // Validate the field on change
      const field = config.Fields.find((f) => f.ID === id);
      if (field) {
        validateSingleField(field, value);
      }
    },
    [config.Fields, validateSingleField]
  );

  const renderedFields = useMemo(() => {
    return config.Fields.map((field, index) => (
      <FormFieldRenderer
        key={field.ID || `field-${index}`}
        field={field}
        fieldValues={fieldValues}
        onFieldChange={handleFieldChange}
        error={field.ID ? errors[field.ID] : undefined}
        formFields={config.Fields}
        validateForm={validateForm}
      />
    ));
  }, [config.Fields, fieldValues, handleFieldChange, errors, validateForm]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{config.Title}</Text>
        <Text style={styles.subtitle}>{config.Subtitle}</Text>
        <View style={styles.fieldsContainer}>{renderedFields}</View>
      </View>
    </ScrollView>
  );
});

DynamicForm.displayName = 'DynamicForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
    fontWeight: '500',
    opacity: 0.8,
  },
  fieldsContainer: {
    width: '100%',
  },
});

export default DynamicForm;
