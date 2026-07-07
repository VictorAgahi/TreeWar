import React from 'react';
import { Card as MuiCard, CardContent } from '@mui/material';
import type { CardProps as MuiCardProps } from '@mui/material';

export interface CardProps extends MuiCardProps {
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, noPadding = false, ...props }) => {
  return (
    <MuiCard {...props}>
      {noPadding ? children : <CardContent>{children}</CardContent>}
    </MuiCard>
  );
};
