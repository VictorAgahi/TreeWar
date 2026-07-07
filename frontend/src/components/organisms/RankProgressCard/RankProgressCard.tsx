import React from 'react';
import { LinearProgress, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import type { LeaderboardEntry } from '../../../types/dashboard.types';
import { formatNumberFr, formatOrdinalFr } from '../../../utils/format';

export interface RankProgressCardProps {
  /** Montant investi par l'entreprise connectée, en crédits. */
  currentInvested: number;
  /** Entreprise juste au-dessus dans le classement. */
  nextRankEntry: LeaderboardEntry;
}

export const RankProgressCard: React.FC<RankProgressCardProps> = ({ currentInvested, nextRankEntry }) => {
  const creditsGap = Math.max(nextRankEntry.totalInvested - currentInvested, 0);
  const nextPlaceLabel = `${formatOrdinalFr(nextRankEntry.rank)} place`;
  const progressPercent = Math.min((currentInvested / nextRankEntry.totalInvested) * 100, 100);

  return (
    <Card>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Vous êtes à {formatNumberFr(creditsGap)} crédits de la {nextPlaceLabel}.
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          aria-label={`Progression vers la ${nextPlaceLabel}`}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary">
          {formatNumberFr(currentInvested)} crédits investis sur les {formatNumberFr(nextRankEntry.totalInvested)} de{' '}
          {nextRankEntry.companyName}
        </Typography>
      </Stack>
    </Card>
  );
};
