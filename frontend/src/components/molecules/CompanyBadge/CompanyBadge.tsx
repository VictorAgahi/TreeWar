import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Box } from '@mui/material';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Chip } from '../../atoms/Chip/Chip';
import { Typography } from '../../atoms/Typography/Typography';

export interface CompanyBadgeProps {
  name: string;
  credits: number;
  avatarUrl?: string;
}

export const CompanyBadge: React.FC<CompanyBadgeProps> = ({ name, credits, avatarUrl }) => {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Box
      component={RouterLink}
      to="/profile"
      sx={{ textDecoration: 'none', color: 'inherit' }}
      aria-label={`Voir le profil de ${name}`}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Chip label={`${credits.toLocaleString('fr-FR')} crédits`} color="primary" variant="outlined" size="small" />
        <Avatar src={avatarUrl} alt={name} sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
          {!avatarUrl && initials}
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
          {name}
        </Typography>
      </Stack>
    </Box>
  );
};
