import { ReactNode, ReactElement } from 'react';
import { Controller, Control, FieldValues, Path, FieldError, ControllerRenderProps, ControllerFieldState, UseFormStateReturn } from 'react-hook-form';
import {
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  FormLabel,
  TextFieldProps,
  SelectProps,
} from '@mui/material';

interface Option {
  value: string | number;
  label: string;
}

interface BaseFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  error?: FieldError;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

interface TextFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea';
  textFieldProps?: Omit<TextFieldProps, 'name' | 'type' | 'error' | 'fullWidth' | 'multiline' | 'rows'>;
  rows?: number;
}

interface SelectFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'select';
  options: Option[];
  selectProps?: Omit<SelectProps, 'name' | 'error' | 'fullWidth'>;
}

interface CheckboxFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'checkbox';
}

interface RadioFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'radio';
  options: Option[];
}

interface CustomFormFieldProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  type: 'custom';
  renderInput: (props: { field: any; fieldState: { error: FieldError | undefined } }) => ReactNode;
}

type FormFieldProps<T extends FieldValues> =
  | TextFormFieldProps<T>
  | SelectFormFieldProps<T>
  | CheckboxFormFieldProps<T>
  | RadioFormFieldProps<T>
  | CustomFormFieldProps<T>;

const FormField = <T extends FieldValues>(props: FormFieldProps<T>) => {
  const {
    name,
    control,
    label,
    error,
    required = false,
    fullWidth = true,
    disabled = false,
    className,
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }: {
        field: ControllerRenderProps<T, Path<T>>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<T>;
      }): ReactElement => {
        const currentError = fieldState.error || error;
        
        // Text fields (including textarea)
        if (props.type === 'text' || props.type === 'email' || props.type === 'password' ||
            props.type === 'number' || props.type === 'tel' || props.type === 'url' || props.type === 'textarea') {
          const { type, textFieldProps = {}, rows } = props;
          const isTextarea = type === 'textarea';
          
          return (
            <TextField
              {...field}
              {...textFieldProps}
              type={isTextarea ? 'text' : type}
              label={label}
              multiline={isTextarea}
              rows={isTextarea ? rows || 4 : undefined}
              error={!!currentError}
              helperText={currentError?.message}
              required={required}
              fullWidth={fullWidth}
              disabled={disabled}
              classes={{root: "font-poppins"}}
              className={`font-josefin ${className}`}
              value={field.value || ''}

            />
          );
        }
        
        // Select field
        if (props.type === 'select') {
          const { options, selectProps = {} } = props;
          
          return (
            <FormControl
              error={!!currentError}
              required={required}
              fullWidth={fullWidth}
              disabled={disabled}
              className={className}
            >
              <InputLabel>{label}</InputLabel>
              <Select
                {...field}
                {...selectProps}
                label={label}
                value={field.value || ''}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {currentError && <FormHelperText>{currentError.message}</FormHelperText>}
            </FormControl>
          );
        }
        
        // Checkbox field
        if (props.type === 'checkbox') {
          return (
            <FormControl
              error={!!currentError}
              required={required}
              fullWidth={fullWidth}
              disabled={disabled}
              className={className}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                    />
                  }
                  label={label || ''}
                />
              </FormGroup>
              {currentError && <FormHelperText>{currentError.message}</FormHelperText>}
            </FormControl>
          );
        }
        
        // Radio field
        if (props.type === 'radio') {
          const { options } = props;
          
          return (
            <FormControl
              error={!!currentError}
              required={required}
              fullWidth={fullWidth}
              disabled={disabled}
              className={className}
            >
              <FormLabel>{label}</FormLabel>
              <RadioGroup
                {...field}
                value={field.value || ''}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {currentError && <FormHelperText>{currentError.message}</FormHelperText>}
            </FormControl>
          );
        }
        
        // Custom field
        if (props.type === 'custom') {
          const result = props.renderInput({ field, fieldState: { error: currentError } });
          return <>{result}</>;
        }
        
        return <div />; // Default return element
      }}
    />
  );
};

export default FormField;
