import React from 'react';
import { alpha, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';
import { Card } from '../../atoms/Card/Card';
import { Chip } from '../../atoms/Chip/Chip';
import { Typography } from '../../atoms/Typography/Typography';
import type { LeaderboardEntry } from '../../../types/dashboard.types';
import { formatCredits, formatNumberFr } from '../../../utils/format';

export interface LeaderboardCardProps {
  /** Les 5 premières entreprises du classement. */
  topEntries: LeaderboardEntry[];
  /** Position de l'entreprise connectée, même hors du top 5. */
  currentEntry: LeaderboardEntry;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ topEntries, currentEntry }) => {
  const theme = useTheme();
  const isCurrentInTop = topEntries.some((entry) => entry.companyName === currentEntry.companyName);
  const highlightSx = { bgcolor: alpha(theme.palette.primary.main, 0.08) };

  const renderRow = (entry: LeaderboardEntry) => {
    const isCurrent = entry.companyName === currentEntry.companyName;
    return (
      <TableRow key={entry.rank} sx={isCurrent ? highlightSx : undefined}>
        <TableCell sx={{ fontWeight: isCurrent ? 700 : 400 }}>{entry.rank}</TableCell>
        <TableCell sx={{ fontWeight: isCurrent ? 700 : 400 }}>
          {entry.companyName}
          {isCurrent ? <Chip label="Vous" color="primary" size="small" sx={{ ml: 1 }} /> : null}
        </TableCell>
        <TableCell align="right">{formatCredits(entry.totalInvested)}</TableCell>
        <TableCell align="right">{formatNumberFr(entry.sponsoredTreesCount)}</TableCell>
      </TableRow>
    );
  };

  return (
    <Card noPadding component="section" sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6" component="h2" sx={{ color: 'primary.dark', fontWeight: 700 }}>
          Classement des entreprises
        </Typography>
      </Box>
      <TableContainer>
        <Table size="small" aria-label="Classement des entreprises" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Entreprise</TableCell>
              <TableCell align="right">Montant investi</TableCell>
              <TableCell align="right">Arbres sponsorisés</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topEntries.map(renderRow)}
            {!isCurrentInTop ? (
              <>
                <TableRow aria-hidden>
                  <TableCell colSpan={4} align="center" sx={{ color: 'text.disabled', py: 0.5 }}>
                    …
                  </TableCell>
                </TableRow>
                {renderRow(currentEntry)}
              </>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
