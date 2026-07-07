import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

export const TextField: React.FC<TextFieldProps> = ({ variant = 'outlined', ...props }) => {
  return <MuiTextField variant={variant} fullWidth {...props} />;
};
