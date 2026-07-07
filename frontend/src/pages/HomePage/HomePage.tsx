import React from 'react';
import { Container, Stack } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Card } from '../../components/atoms/Card/Card';
import { Typography } from '../../components/atoms/Typography/Typography';
import { ParisTreeMap } from '../../components/organisms/ParisTreeMap/ParisTreeMap';

const LEADERBOARD_PREVIEW = [
  { rank: 1, company: 'EcoBank', trees: 42 },
  { rank: 2, company: 'GreenTech Corp', trees: 31 },
  { rank: 3, company: 'Ville Verte SA', trees: 28 },
];

export const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Carte des arbres de Paris
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enchérissez sur les arbres de la ville et faites grimper votre entreprise au sommet du classement.
        </Typography>
      </Stack>

      <Card noPadding sx={{ flex: 1, minHeight: 420, display: 'flex' }}>
        <ParisTreeMap />
      </Card>

      <Card>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <EmojiEventsIcon color="primary" />
          <Typography variant="h6">Top du classement</Typography>
        </Stack>
        <Stack spacing={1.5}>
          {LEADERBOARD_PREVIEW.map((entry) => (
            <Stack key={entry.rank} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                #{entry.rank} {entry.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.trees} arbres
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Container>
  );
};
