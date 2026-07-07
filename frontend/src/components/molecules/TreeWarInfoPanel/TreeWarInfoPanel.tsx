import React, { useState } from 'react';
import { Box, IconButton, Stack, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ParkIcon from '@mui/icons-material/Park';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeStatusBadge } from '../../atoms/TreeStatusBadge/TreeStatusBadge';
import type { ParisTree as Tree } from '../../../types/tree';
import { axiosClient } from '../../../api/axiosClient';
import { treeApi } from '../../../api/tree.api';
import { useAuth } from '../../../context/AuthContext';
import { formatCredits } from '../../../utils/format';

export interface TreeWarInfoPanelProps {
  tree: Tree;
  onClose: () => void;
  onBuySuccess: () => void;
}

export const TreeWarInfoPanel: React.FC<TreeWarInfoPanelProps> = ({ tree, onClose, onBuySuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user && tree.sponsorship.ownerId === user.id;
  const currentPrice = tree.sponsorship.currentPrice || 100;

  const handleBuy = async () => {
    try {
      setLoading(true);
      setError(null);
      const newAmount = currentPrice + 100; 
      await axiosClient.request({
        ...treeApi.buy(),
        data: {
          treeId: tree.sponsorship.dbTreeId,
          amount: newAmount,
          lat: tree.lat,
          lng: tree.lon
        }
      });
      onBuySuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du parrainage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 320,
        zIndex: 1000,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <ParkIcon color="primary" />
          <Typography variant="h3" sx={{ fontSize: 18 }}>
            {tree.name}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} aria-label="Fermer la fiche arbre">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ mt: 1, mb: 1.5 }}>
        <TreeStatusBadge sponsorship={tree.sponsorship} />
      </Box>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2">Prix actuel : {formatCredits(currentPrice)}</Typography>
        {isOwner && (
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
            Vous possédez cet arbre !
          </Typography>
        )}
      </Stack>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!isOwner && user && (
        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={handleBuy}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Parrainage en cours...' : `Parrainer pour ${formatCredits(currentPrice + 100)}`}
        </Button>
      )}
      
      {!user && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Connectez-vous pour parrainer.
        </Typography>
      )}
    </Card>
  );
};
