import React from 'react';
import { Container, Stack } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Card } from '../../components/atoms/Card/Card';
import { Typography } from '../../components/atoms/Typography/Typography';
import { ParisTreeMap } from '../../components/organisms/ParisTreeMap/ParisTreeMap';

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
        <Typography variant="body2" color="text.secondary">
          Aucune entreprise n'a encore parrainé d'arbre. Soyez la première !
        </Typography>
      </Card>
    </Container>
  );
};
