import { useForm, UseFormProps, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectSchema } from 'yup';
import { useState } from 'react';

interface UseFormWithValidationProps<T extends FieldValues> extends UseFormProps<T> {
  validationSchema: ObjectSchema<any>;
  onSubmit: (data: T) => void | Promise<void>;
}

export const useFormWithValidation = <T extends FieldValues>({
  validationSchema,
  onSubmit,
  ...formOptions
}: UseFormWithValidationProps<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formMethods = useForm<T>({
    ...formOptions,
    resolver: yupResolver(validationSchema),
  });
  
  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    ...formMethods,
    isSubmitting,
    handleSubmit: formMethods.handleSubmit(handleSubmit),
  };
};
