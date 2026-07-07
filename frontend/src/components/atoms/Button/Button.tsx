import React from 'react';
import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'disableRipple'> {}

export const Button: React.FC<ButtonProps> = (props) => {
  return <MuiButton disableRipple {...props} />;
};
