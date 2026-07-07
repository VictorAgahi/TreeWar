import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { Button } from '../../atoms/Button/Button';
import { Typography } from '../../atoms/Typography/Typography';

export interface DashboardHeaderProps {
  companyName: string;
  mapPath: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ companyName, mapPath }) => {
  return (
    <Stack
      component="header"
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Dashboard {companyName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Suivez vos arbres sponsorisés, vos investissements et votre position dans le classement.
        </Typography>
      </Stack>
      <Button component={RouterLink} to={mapPath} variant="outlined" startIcon={<MapIcon />}>
        Retour à la carte
      </Button>
    </Stack>
  );
};
