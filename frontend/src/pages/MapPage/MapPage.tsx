import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Card } from '../../components/atoms/Card/Card';
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
    <Container maxWidth="xl" sx={{ py: 2, flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Card noPadding sx={{ flex: 1, display: 'flex', width: '100%', height: '100%' }}>
        <TreeWarMap />
      </Card>
    </Container>
  );
};
