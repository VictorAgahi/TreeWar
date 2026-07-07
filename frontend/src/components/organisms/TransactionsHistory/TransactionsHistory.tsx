import React, { useState } from 'react';
import { Stack } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { Button } from '../../atoms/Button/Button';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import type { SponsoredTree } from '../../../types/dashboard.types';
import { formatCredits, formatDateFr, formatOrdinalFr } from '../../../utils/format';

const VISIBLE_COUNT = 5;

export interface TransactionsHistoryProps {
  /** Achats triés du plus récent au plus ancien. */
  transactions: SponsoredTree[];
}

export const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({ transactions }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleTransactions = showAll ? transactions : transactions.slice(0, VISIBLE_COUNT);

  return (
    <Card component="section" sx={{ height: '100%' }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" component="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Dernières transactions
          </Typography>
        </Stack>
        {visibleTransactions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune transaction pour le moment.
          </Typography>
        ) : (
          <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {visibleTransactions.map((transaction) => (
              <Stack
                key={transaction.id}
                component="li"
                direction="row"
                spacing={1}
                sx={{ flexWrap: 'wrap', alignItems: 'baseline' }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 84 }}>
                  {formatDateFr(transaction.purchasedAt)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {transaction.itemType === 'CREDITS' ? 'Recharge de crédits' : transaction.species}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transaction.itemType === 'CREDITS' ? '— Achat —' : `— Paris ${formatOrdinalFr(transaction.arrondissement)} —`}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: transaction.itemType === 'CREDITS' ? 'success.main' : 'inherit' }}>
                  {transaction.itemType === 'CREDITS' ? '+' : ''}{formatCredits(transaction.pricePaid)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
        {!showAll && transactions.length > VISIBLE_COUNT ? (
          <Button variant="text" onClick={() => setShowAll(true)} sx={{ alignSelf: 'flex-start' }}>
            Voir tout l'historique
          </Button>
        ) : null}
      </Stack>
    </Card>
  );
};
