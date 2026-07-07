import React, { useState } from 'react';
import { Stack } from '@mui/material';
import { TextField } from '../../atoms/TextField/TextField';
import { Button } from '../../atoms/Button/Button';
import { Typography } from '../../atoms/Typography/Typography';

export interface SponsorTreeFormProps {
  minAmount: number;
  isOutbid: boolean;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onSubmit: (amount: number, customName: string) => void;
}

export const SponsorTreeForm: React.FC<SponsorTreeFormProps> = ({
  minAmount,
  isOutbid,
  isSubmitting,
  errorMessage,
  onSubmit,
}) => {
  const [amount, setAmount] = useState(minAmount);
  const [customName, setCustomName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(amount, customName);
  };

  return (
    <Stack component="form" spacing={1} sx={{ mt: 1.5 }} onSubmit={handleSubmit}>
      <TextField
        type="number"
        size="small"
        label="Montant (crédits)"
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
        slotProps={{ htmlInput: { min: minAmount } }}
      />
      <TextField
        size="small"
        label="Nom de l'arbre (optionnel)"
        value={customName}
        onChange={(event) => setCustomName(event.target.value)}
      />
      {errorMessage && (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      )}
      <Button type="submit" variant="contained" size="small" disabled={isSubmitting || amount < minAmount}>
        {isSubmitting ? 'Enchère en cours…' : isOutbid ? 'Surenchérir' : 'Parrainer cet arbre'}
      </Button>
    </Stack>
  );
};
