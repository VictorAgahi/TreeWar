import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import ParkIcon from '@mui/icons-material/Park';
import PlaceIcon from '@mui/icons-material/Place';
import { Button } from '../../atoms/Button/Button';
import { Card } from '../../atoms/Card/Card';
import { Chip } from '../../atoms/Chip/Chip';
import { Typography } from '../../atoms/Typography/Typography';
import type { SponsoredTree } from '../../../types/dashboard.types';
import { formatCredits, formatDateFr, formatOrdinalFr } from '../../../utils/format';

export interface PremiumTreeCardProps {
  tree: SponsoredTree;
  mapLink: string;
  rank?: number;
}

export const PremiumTreeCard: React.FC<PremiumTreeCardProps> = ({ tree, mapLink, rank }) => {
  return (
    <Card component="section" sx={{ height: '100%' }}>
      <Stack spacing={2} sx={{ height: '100%' }}>
        {rank !== undefined && (
          <Typography variant="h6" component="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Top {rank}
          </Typography>
        )}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 3,
              bgcolor: 'action.hover',
              flexShrink: 0,
            }}
          >
            <ParkIcon color="primary" sx={{ fontSize: 36 }} />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
              {tree.species}
            </Typography>
            <Chip
              label={formatCredits(tree.pricePaid)}
              color="primary"
              size="small"
              sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
            />
            <Typography variant="body2" color="text.secondary">
              Paris {formatOrdinalFr(tree.arrondissement)} arrondissement
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Parrainé le {formatDateFr(tree.purchasedAt)}
            </Typography>
          </Stack>
        </Stack>
        <Button
          component={RouterLink}
          to={mapLink}
          variant="contained"
          startIcon={<PlaceIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Voir sur la carte
        </Button>
      </Stack>
    </Card>
  );
};
