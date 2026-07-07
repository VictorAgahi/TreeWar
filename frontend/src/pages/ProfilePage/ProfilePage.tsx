import React from 'react';
import { Container, Stack, Box, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Card } from '../../components/atoms/Card/Card';
import { Typography } from '../../components/atoms/Typography/Typography';
import { Avatar } from '../../components/atoms/Avatar/Avatar';
import { Chip } from '../../components/atoms/Chip/Chip';
import { Button } from '../../components/atoms/Button/Button';

const COMPANY = {
  name: 'GreenTech Corp',
  email: 'contact@greentech-corp.fr',
  joinedAt: 'Membre depuis le 01/07/2026',
  credits: 4200,
  totalSpent: 5800,
  treesOwned: 12,
  rank: 3,
};

export const ProfilePage: React.FC = () => {
  const initials = COMPANY.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Container maxWidth="sm" sx={{ py: 4, flex: 1 }}>
      <Card>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 24 }}>{initials}</Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {COMPANY.name}
              </Typography>
              <Chip label={`#${COMPANY.rank} au classement`} color="primary" size="small" sx={{ mt: 0.5 }} />
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {COMPANY.email}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <CalendarTodayIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {COMPANY.joinedAt}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {COMPANY.credits.toLocaleString('fr-FR')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Crédits
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {COMPANY.totalSpent.toLocaleString('fr-FR')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Dépensés
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {COMPANY.treesOwned}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Arbres
              </Typography>
            </Stack>
          </Box>

          <Button variant="outlined" color="primary">
            Modifier le profil
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};
