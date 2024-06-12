// InputField.tsx
import React from 'react';
import { Grid, TextField } from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface InputFieldProps {
  register: UseFormRegister<any>;
  name: string;
  label: string;
  type?: string;
  error?: boolean;  // Adicionado para tratamento de erros
  helperText?: string;  // Adicionado para mostrar mensagens de erro
  
}

export const InputField: React.FC<InputFieldProps> = ({ register, name, label, type, error,helperText}) => (
  <Grid item xs={12} sm={6}>
    
    <TextField
      {...register(name)}
      fullWidth
      label={label}
      type={type}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      defaultValue={type === ('text'|| 'email') ? "" : ""}
      error={error}  // Aplicar o estado de erro
      helperText={helperText}  // Exibir a mensagem de erro
    />
  </Grid>
);
