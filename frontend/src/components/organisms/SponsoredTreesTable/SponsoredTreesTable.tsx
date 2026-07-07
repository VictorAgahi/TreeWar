import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Button } from '../../atoms/Button/Button';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import type { SponsoredTree } from '../../../types/dashboard.types';
import { formatCredits, formatDateFr, formatOrdinalFr } from '../../../utils/format';

type SortKey = 'pricePaid' | 'purchasedAt';
type SortDirection = 'asc' | 'desc';

const ALL_ARRONDISSEMENTS = 'all';

const compareTrees = (a: SponsoredTree, b: SponsoredTree, sortKey: SortKey): number => {
  if (sortKey === 'pricePaid') {
    return a.pricePaid - b.pricePaid;
  }
  return a.purchasedAt.localeCompare(b.purchasedAt) || a.pricePaid - b.pricePaid;
};

export interface SponsoredTreesTableProps {
  trees: SponsoredTree[];
  /** Construit le lien "Voir sur la carte" pour un arbre. */
  getMapLink: (tree: SponsoredTree) => string;
}

export const SponsoredTreesTable: React.FC<SponsoredTreesTableProps> = ({ trees, getMapLink }) => {
  const [sortKey, setSortKey] = useState<SortKey>('purchasedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [arrondissementFilter, setArrondissementFilter] = useState<string>(ALL_ARRONDISSEMENTS);

  const arrondissements = Array.from(new Set(trees.map((tree) => tree.arrondissement))).sort((a, b) => a - b);

  const filteredTrees =
    arrondissementFilter === ALL_ARRONDISSEMENTS
      ? trees
      : trees.filter((tree) => tree.arrondissement === Number(arrondissementFilter));

  const sortedTrees = [...filteredTrees].sort((a, b) => {
    const comparison = compareTrees(a, b, sortKey);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('desc');
  };

  const sortableHeader = (key: SortKey, label: string) => (
    <TableCell align="right" sortDirection={sortKey === key ? sortDirection : false}>
      <TableSortLabel
        active={sortKey === key}
        direction={sortKey === key ? sortDirection : 'desc'}
        onClick={() => handleSort(key)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Card noPadding component="section">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ px: 2, pt: 2, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}
      >
        <Typography variant="h6" component="h2" sx={{ color: 'primary.dark', fontWeight: 700 }}>
          Arbres sponsorisés
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="arrondissement-filter-label">Arrondissement</InputLabel>
          <Select
            labelId="arrondissement-filter-label"
            label="Arrondissement"
            value={arrondissementFilter}
            onChange={(event) => setArrondissementFilter(event.target.value)}
          >
            <MenuItem value={ALL_ARRONDISSEMENTS}>Tous</MenuItem>
            {arrondissements.map((arrondissement) => (
              <MenuItem key={arrondissement} value={String(arrondissement)}>
                {formatOrdinalFr(arrondissement)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <TableContainer>
        <Table aria-label="Arbres sponsorisés" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Espèce</TableCell>
              <TableCell>Arrondissement</TableCell>
              {sortableHeader('pricePaid', 'Prix payé')}
              {sortableHeader('purchasedAt', "Date d'achat")}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTrees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary">
                    Aucun arbre sponsorisé dans cet arrondissement.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedTrees.map((tree) => (
                <TableRow key={tree.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{tree.species}</TableCell>
                  <TableCell>{formatOrdinalFr(tree.arrondissement)}</TableCell>
                  <TableCell align="right">{formatCredits(tree.pricePaid)}</TableCell>
                  <TableCell align="right">{formatDateFr(tree.purchasedAt)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        component={RouterLink}
                        to={getMapLink(tree)}
                        size="small"
                        variant="outlined"
                        aria-label={`Voir sur la carte : ${tree.species}, ${formatOrdinalFr(tree.arrondissement)} arrondissement`}
                        sx={{ whiteSpace: 'nowrap', px: 2, py: 0.5 }}
                      >
                        Voir sur la carte
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
