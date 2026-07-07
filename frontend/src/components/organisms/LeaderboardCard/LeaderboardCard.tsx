import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { alpha, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, Tabs, Tab, Tooltip, IconButton } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { Card } from '../../atoms/Card/Card';
import { Chip } from '../../atoms/Chip/Chip';
import { Typography } from '../../atoms/Typography/Typography';
import type { LeaderboardEntry } from '../../../types/dashboard.types';
import { formatCredits, formatNumberFr } from '../../../utils/format';

export interface LeaderboardCardProps {
  topEntriesTV: LeaderboardEntry[];
  topEntriesMT: LeaderboardEntry[];
  topEntriesET: LeaderboardEntry[];
  currentEntry: LeaderboardEntry;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ topEntriesTV, topEntriesMT, topEntriesET, currentEntry }) => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);

  const getTopEntries = () => {
    if (tabIndex === 0) return topEntriesTV;
    if (tabIndex === 1) return topEntriesMT;
    return topEntriesET;
  };

  const topEntries = getTopEntries();
  const isCurrentInTop = topEntries.some((entry) => entry.companyName === currentEntry.companyName);
  const highlightSx = { bgcolor: alpha(theme.palette.primary.main, 0.08) };

  const renderRow = (entry: LeaderboardEntry) => {
    const isCurrent = entry.companyName === currentEntry.companyName;
    return (
      <TableRow key={entry.companyName} sx={isCurrent ? highlightSx : undefined}>
        <TableCell sx={{ fontWeight: isCurrent ? 700 : 400 }}>{entry.rank > 0 ? entry.rank : '-'}</TableCell>
        <TableCell sx={{ fontWeight: isCurrent ? 700 : 400 }}>
          {entry.companyName}
          {isCurrent ? <Chip label="Vous" color="primary" size="small" sx={{ ml: 1 }} /> : null}
        </TableCell>
        {tabIndex === 0 && <TableCell align="right">{formatCredits(entry.totalInvested)}</TableCell>}
        {tabIndex === 1 && <TableCell align="right">{formatNumberFr(entry.sponsoredTreesCount)}</TableCell>}
        {tabIndex === 2 && <TableCell align="right">{formatCredits(entry.maxTreePrice || 0)}</TableCell>}
        <TableCell align="right">
          <Tooltip title="Voir sur la carte">
            <IconButton 
              component={RouterLink} 
              to={tabIndex === 2 && entry.maxTreeId 
                ? `/map?treeId=${entry.maxTreeId}` 
                : `/map?company=${encodeURIComponent(entry.companyName)}`
              }
              color="primary"
              size="small"
            >
              <MapIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Card noPadding component="section" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6" component="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Classement des entreprises
        </Typography>
        <Tabs 
          value={tabIndex} 
          onChange={(_, newValue) => setTabIndex(newValue)} 
          variant="scrollable" 
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mt: 1 }}
        >
          <Tab label="Valeur totale" />
          <Tab label="Le plus d'arbres" />
          <Tab label="Arbre le plus cher" />
        </Tabs>
      </Box>
      <TableContainer sx={{ flex: 1 }}>
        <Table size="small" aria-label="Classement des entreprises" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell>Entreprise</TableCell>
              {tabIndex === 0 && <TableCell align="right">Valeur totale</TableCell>}
              {tabIndex === 1 && <TableCell align="right">Arbres</TableCell>}
              {tabIndex === 2 && <TableCell align="right">Arbre Max</TableCell>}
              <TableCell align="right">Action</TableCell>
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
