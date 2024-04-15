// InputField.tsx
import React from 'react';
import { Grid, TextField } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface InputFieldProps {
  register: UseFormRegister<any>;
  name: string;
  label: string;
  type?: string;
  error?: FieldErrors;
  
}

export const InputField: React.FC<InputFieldProps> = ({ register, name, label, type, error}) => (
  <Grid item xs={12} sm={6}>
    
    <TextField
      {...register(name)}
      fullWidth
      label={label}
      type={type}
      error={!!error}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      defaultValue={type === 'text' ? "-" : 0}
    />
  </Grid>
);
