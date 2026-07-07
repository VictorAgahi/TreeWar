import React, { useEffect, useState } from 'react';
import { Container, Stack } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Card } from '../../components/atoms/Card/Card';
import { Typography } from '../../components/atoms/Typography/Typography';
import { TreeWarMap } from '../../components/organisms/TreeWarMap/TreeWarMap';
import { axiosClient } from '../../api/axiosClient';
import { leaderboardApi } from '../../api/leaderboard.api';
import type { LeaderboardEntry } from '../../api/leaderboard.api';

export const MapPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let cancelled = false;

    axiosClient
      .request<LeaderboardEntry[]>(leaderboardApi.totalValue())
      .then((result) => {
        if (!cancelled) {
          setLeaderboard(result.data.filter((entry) => entry.totalValue > 0));
        }
      })
      .catch(() => {
        // Leaderboard is a nice-to-have on this page; a failed fetch just keeps the empty state.
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        <TreeWarMap />
      </Card>

      <Card>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <EmojiEventsIcon color="primary" />
          <Typography variant="h6">Top du classement</Typography>
        </Stack>
        {leaderboard.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune entreprise n'a encore parrainé d'arbre. Soyez la première !
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {leaderboard.map((entry, index) => (
              <Stack key={entry.id} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  #{index + 1} {entry.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.totalValue} crédits
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Card>
    </Container>
  );
};
