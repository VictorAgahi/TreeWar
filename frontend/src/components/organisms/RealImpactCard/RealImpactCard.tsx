import React from 'react';
import { alpha, Box, Stack, useTheme } from '@mui/material';
import ForestIcon from '@mui/icons-material/Forest';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { formatNumberFr } from '../../../utils/format';

export interface RealImpactCardProps {
  /** Arbres plantés financés par les crédits investis. */
  realTreesPlanted: number;
  title?: string;
  subtitle?: string;
}

export const RealImpactCard: React.FC<RealImpactCardProps> = ({ realTreesPlanted, title, subtitle }) => {
  const theme = useTheme();

  return (
    <Card
      component="section"
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.08),
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.24),
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 3,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            flexShrink: 0,
          }}
        >
          <ForestIcon sx={{ fontSize: 36 }} />
        </Box>
        <Stack spacing={0.25}>
          <Typography variant="body2" color="text.secondary">
            {title || 'Impact réel'}
          </Typography>
          <Typography variant="h4" component="p" color="primary.dark" sx={{ fontWeight: 700 }}>
            {formatNumberFr(realTreesPlanted)} arbres plantés
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle || 'Financés par vos crédits investis.'}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
