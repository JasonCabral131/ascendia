/** @format */

export interface Option {
  label: string;
  value: any;
  id: string;
}

export interface InputElement {
  type: 'icon' | 'button' | 'url';
  content: string; // Icon name, button text, or URL
  action?: 'toggle-secure' | 'clear' | 'custom' | 'open-url';
  buttonStyle?: 'primary' | 'secondary' | 'link';
}

export interface FormField {
  ID: string; // Made required for validation
  Type: 'H1' | 'Text' | 'Button' | 'Radio' | 'Select';
  Text?: string;
  Placeholder?: string;
  Title?: string;
  AlertMessage?: string;
  Options?: Option[];
  Multiple?: boolean; // For Select field to support multiple selection
  // Select field modal titles
  ModalTitle?: string; // Custom modal title for Select field
  ModalTitleSingle?: string; // Title for single selection mode
  ModalTitleMultiple?: string; // Title for multiple selection mode
  // Text field specific properties
  KeyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  AutoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  SecureTextEntry?: boolean;
  Multiline?: boolean;
  NumberOfLines?: number;
  MaxLength?: number;
  // Enhanced element properties
  LeftElement?: InputElement;
  RightElement?: InputElement;
  // Legacy icon properties (for backward compatibility)
  LeftIcon?: string;
  RightIcon?: string;
  RightIconAction?: 'toggle-secure' | 'clear' | 'custom';
  // Validation properties
  Required?: boolean;
  ValidationRegex?: string;
  ValidationFunction?: string; // Function name that returns true/false
  ValidationMessage?: string; // Custom error message
}

export interface FormConfig {
  Title: string;
  Subtitle: string;
  Fields: FormField[];
}

export interface FieldValues {
  [key: string]: string | string[];
}
