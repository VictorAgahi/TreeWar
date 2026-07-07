import React, { useState } from 'react';
import { Box, IconButton, Stack, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ParkIcon from '@mui/icons-material/Park';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeStatusBadge } from '../../atoms/TreeStatusBadge/TreeStatusBadge';
import type { BackendTree as Tree } from '../../../api/tree.api';
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

  const isOwner = user && tree.ownerId === user.id;

  const handleBuy = async () => {
    try {
      setLoading(true);
      setError(null);
      // Let's increment the price by a random amount or a fixed step like +100
      const newAmount = tree.price + 100; 
      await axiosClient.request({
        ...treeApi.buy(),
        data: {
          treeId: tree.id,
          amount: newAmount,
          lat: tree.location.coordinates[1],
          lng: tree.location.coordinates[0]
        }
      });
      onBuySuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'achat.');
    } finally {
      setLoading(false);
    }
  };

  const sponsorship = tree.ownerId ? { status: 'sponsored' as const, sponsorName: tree.owner?.username } : { status: 'available' as const };

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
        <TreeStatusBadge sponsorship={sponsorship} />
      </Box>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="body2">Prix actuel : {formatCredits(tree.price)}</Typography>
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
          {loading ? 'Achat en cours...' : `Acheter pour ${formatCredits(tree.price + 100)}`}
        </Button>
      )}
      
      {!user && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Connectez-vous pour acheter.
        </Typography>
      )}
    </Card>
  );
};
