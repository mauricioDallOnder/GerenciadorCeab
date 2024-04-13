// FormSection.tsx
import React from 'react';
import { List, Typography, Grid } from '@mui/material';
import { ListStyle, TituloSecaoStyle } from "@/utils/styles";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <List sx={ListStyle}>
    <Typography sx={TituloSecaoStyle}>{title}</Typography>
    <Grid container spacing={2}>{children}</Grid>
  </List>
);
