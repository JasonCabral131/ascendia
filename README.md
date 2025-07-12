<!-- @format -->

# Dynamic Form React Native App

A React Native application that dynamically renders forms based on JSON configuration with proper TypeScript typing, memoization, and clean architecture.

## Features

- **Dynamic Form Rendering**: Renders forms based on JSON configuration
- **Type Safety**: Full TypeScript support with proper interfaces
- **Performance Optimized**: Uses React.memo, useCallback, and useMemo for optimal performance
- **Extensible**: Easy to add new field types and configurations
- **Clean Architecture**: Well-separated components with single responsibilities

## Architecture

### Components Structure

```
components/
├── form/
│   ├── DynamicForm.tsx          # Main form container
│   ├── FormFieldRenderer.tsx    # Individual field renderer
│   ├── HeaderField.tsx          # H1 field component
│   ├── TextField.tsx            # Text input field component
│   ├── ButtonField.tsx          # Button field component
│   ├── RadioField.tsx           # Radio button field component
│   └── SelectField.tsx          # Select dropdown field component
├── LoadingScreen.tsx            # Loading state component
└── ErrorScreen.tsx              # Error state component
```

### Key Features

#### Memoization Strategy

- **React.memo**: All components are wrapped with memo for prop-based re-render prevention
- **useCallback**: Event handlers are memoized to prevent unnecessary re-renders
- **useMemo**: Complex calculations and arrays are memoized
- **useRef**: Used to store field values for optimization

#### Type Safety

- **FormConfig**: Main configuration interface
- **FormField**: Individual field configuration
- **FieldValues**: Dynamic field values storage

#### Alert Message Parsing

The app supports dynamic variable substitution in alert messages:

- Use `${field-id}` syntax to reference field values
- Example: `"Hello ${first-name} ${last-name}!"` will replace variables with actual field values

## JSON Configuration Format

```json
{
  "Title": "Your App Title",
  "Subtitle": "Your Name",
  "Fields": [
    {
      "Type": "H1",
      "Text": "Section Header"
    },
    {
      "ID": "person-name",
      "Type": "Text",
      "Placeholder": "Enter your name",
      "AutoCapitalize": "words",
      "MaxLength": 50,
      "LeftIcon": "person-outline",
      "RightIconAction": "clear"
    },
    {
      "ID": "email",
      "Type": "Text",
      "Placeholder": "Enter your email",
      "KeyboardType": "email-address",
      "AutoCapitalize": "none",
      "MaxLength": 100,
      "LeftIcon": "mail-outline",
      "RightIconAction": "clear"
    },
    {
      "ID": "password",
      "Type": "Text",
      "Placeholder": "Enter password",
      "SecureTextEntry": true,
      "AutoCapitalize": "none",
      "MaxLength": 50,
      "LeftIcon": "lock-closed-outline",
      "RightIconAction": "toggle-secure"
    },
    {
      "ID": "bio",
      "Type": "Text",
      "Placeholder": "Tell us about yourself...",
      "Multiline": true,
      "NumberOfLines": 3,
      "MaxLength": 200,
      "LeftIcon": "document-text-outline"
    },
    {
      "ID": "radio-field",
      "Type": "Radio",
      "Options": [
        {
          "label": "Option 1",
          "value": "option1",
          "id": "radio-option1"
        },
        {
          "label": "Option 2",
          "value": "option2",
          "id": "radio-option2"
        }
      ]
    },
    {
      "ID": "select-field",
      "Type": "Select",
      "Multiple": true,
      "Placeholder": "Select options",
      "Options": [
        {
          "label": "Choice A",
          "value": "choiceA",
          "id": "select-choiceA"
        },
        {
          "label": "Choice B",
          "value": "choiceB",
          "id": "select-choiceB"
        }
      ]
    },
    {
      "ID": "button-id",
      "Type": "Button",
      "Title": "Button Text",
      "AlertMessage": "Selected: ${radio-field}, Multiple: ${select-field}"
    }
  ]
}
```

### Supported Field Types

1. **H1**: Header text

   - `Text`: The header content

2. **Text**: Enhanced text input field with icons

   - `ID`: Unique identifier (required)
   - `Placeholder`: Input placeholder text
   - `KeyboardType`: Keyboard type ('default' | 'email-address' | 'numeric' | 'phone-pad' | 'url')
   - `AutoCapitalize`: Auto-capitalization ('none' | 'sentences' | 'words' | 'characters')
   - `SecureTextEntry`: Boolean for password fields
   - `Multiline`: Boolean for multi-line text areas
   - `NumberOfLines`: Number of lines for multiline inputs
   - `MaxLength`: Maximum character length
   - `LeftIcon`: Ionicon name for left side icon
   - `RightIcon`: Ionicon name for right side icon
   - `RightIconAction`: Action for right icon ('toggle-secure' | 'clear' | 'custom')

3. **Radio**: Radio button group

   - `ID`: Unique identifier (required)
   - `Options`: Array of options with `label`, `value`, and `id` properties

4. **Select**: Dropdown select field

   - `ID`: Unique identifier (required)
   - `Options`: Array of options with `label`, `value`, and `id` properties
   - `Multiple`: Boolean to enable multiple selection (default: false)
   - `Placeholder`: Placeholder text for the select field

5. **Button**: Clickable button
   - `ID`: Unique identifier (required)
   - `Title`: Button label
   - `AlertMessage`: Message shown on tap (supports variable substitution)

## Usage

1. Update the JSON configuration in `data/formConfig.json`
2. The app will automatically render the form based on the configuration
3. Add as many fields as needed - the app will handle them dynamically
4. Use variable substitution in button alert messages to create dynamic content

## Performance Considerations

- Components are memoized to prevent unnecessary re-renders
- Field values are managed efficiently with useCallback and useState
- Large forms are rendered in a ScrollView with proper optimization
- Error and loading states are handled gracefully

## Extending the App

To add new field types:

1. Create a new component in `components/form/`
2. Add the field type to the `FormField` interface
3. Update the `FormFieldRenderer` to handle the new type
4. Wrap the component with `memo` for performance

Example:

```typescript
// New field type
interface SelectFieldProps {
  id: string;
  options: string[];
  value: string;
  onValueChange: (id: string, value: string) => void;
}

const SelectField = memo<SelectFieldProps>(
  ({ id, options, value, onValueChange }) => {
    // Implementation
  }
);
```

This architecture ensures the app remains maintainable, performant, and easily extensible.
