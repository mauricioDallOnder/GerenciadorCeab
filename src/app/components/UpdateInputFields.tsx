// InputField.tsx
import React from 'react';
import { Grid, InputLabel, TextField } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface InputFieldProps {
  register: UseFormRegister<any>;
  name: string;
  label: string;
  type?: string;
  error?: FieldErrors;

}

export const UpdateInputField: React.FC<InputFieldProps> = ({ register, name, label, type, error }) => (
  <Grid item xs={12} sm={6}>
    <InputLabel
      shrink
    >
      {label}
    </InputLabel>
    <TextField
      {...register(name)}
      fullWidth

      type={type}
      error={!!error}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      variant='standard'

    />
  </Grid>
);
