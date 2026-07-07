import React from 'react';
import { Stack } from '@mui/material';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';

export interface KpiCardProps {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, description, icon }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        {icon}
        <Stack spacing={0.25}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
