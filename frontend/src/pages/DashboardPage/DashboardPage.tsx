import React from 'react';
import { Container, Stack, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import ParkIcon from '@mui/icons-material/Park';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { Card } from '../../components/atoms/Card/Card';
import { Typography } from '../../components/atoms/Typography/Typography';

const STATS = [
  { label: 'Total dépensé', value: '5 800 crédits', icon: <PaidIcon color="primary" /> },
  { label: 'Arbres possédés', value: '12', icon: <ParkIcon color="primary" /> },
  { label: 'Crédits restants', value: '4 200', icon: <AccountBalanceWalletIcon color="primary" /> },
  { label: 'Rang actuel', value: '3ème / 24', icon: <MilitaryTechIcon color="primary" /> },
];

const OWNED_TREES = [
  { species: 'Platane', arrondissement: 15, price: 320, date: '06/07/2026' },
  { species: 'Marronnier', arrondissement: 7, price: 480, date: '05/07/2026' },
  { species: 'Tilleul', arrondissement: 15, price: 210, date: '04/07/2026' },
];

export const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Mon Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vos investissements et votre position dans la compétition.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              {stat.icon}
              <Stack>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Box>

      <Card noPadding>
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="h6">Arbres possédés</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Espèce</TableCell>
                <TableCell>Arrondissement</TableCell>
                <TableCell align="right">Prix payé</TableCell>
                <TableCell align="right">Date d'achat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {OWNED_TREES.map((tree) => (
                <TableRow key={`${tree.species}-${tree.arrondissement}-${tree.date}`}>
                  <TableCell>{tree.species}</TableCell>
                  <TableCell>{tree.arrondissement}ème</TableCell>
                  <TableCell align="right">{tree.price} crédits</TableCell>
                  <TableCell align="right">{tree.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};
