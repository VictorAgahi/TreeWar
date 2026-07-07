import React, { useState } from 'react';
import { Box, IconButton, Stack, Button, CircularProgress, TextField, Divider, Chip, CardMedia } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ParkIcon from '@mui/icons-material/Park';
import HeightIcon from '@mui/icons-material/Height';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user && tree.sponsorship.ownerId === user.id;
  const currentPrice = tree.sponsorship.currentPrice || 100;
  const isSponsored = tree.sponsorship.status === 'sponsored';
  const minBid = isSponsored ? currentPrice + 10 : currentPrice;
  
  const [newName, setNewName] = useState('');
  const [bidAmount, setBidAmount] = useState<number | string>(minBid);

  const handleBuy = async () => {
    const amountToBid = Number(bidAmount);
    if (isNaN(amountToBid) || amountToBid < minBid) {
      setError(`L'offre doit être d'au moins ${formatCredits(minBid)}.`);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await axiosClient.request({
        ...treeApi.buy(),
        data: {
          treeId: tree.sponsorship.dbTreeId,
          amount: amountToBid,
          newName: newName.trim() || undefined,
          lat: tree.lat,
          lng: tree.lon
        }
      });
      await refreshUser();
      onBuySuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du parrainage.');
    } finally {
      setLoading(false);
    }
  };

  const displayName = tree.sponsorship.customName || tree.name;
  const scientificName = [tree.genus, tree.species].filter(Boolean).join(' ');
  const hasImage = !!tree.remarkable?.photoUrl;

  return (
    <Card
      noPadding
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 380,
        maxHeight: 'calc(100dvh - 32px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          overflowY: 'auto',
          flex: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '3px' },
        }}
      >
        <Box sx={{ position: 'relative' }}>
        {hasImage && (
          <CardMedia
            component="img"
            height="200"
            image={tree.remarkable!.photoUrl!}
            alt={displayName}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <IconButton 
          size="small" 
          onClick={onClose} 
          aria-label="Fermer la fiche arbre"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            bgcolor: hasImage ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.05)',
            backdropFilter: hasImage ? 'blur(4px)' : 'none',
            '&:hover': { bgcolor: hasImage ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.1)' }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Stack spacing={2.5} sx={{ p: 3, pt: hasImage ? 2.5 : 3 }}>
        {/* Header */}
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', mb: 1 }}>
            {!hasImage && (
              <Box sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', p: 1, borderRadius: 1.5, display: 'flex' }}>
                <ParkIcon fontSize="small" />
              </Box>
            )}
            <Box>
              <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                {displayName}
              </Typography>
              {scientificName && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                  {scientificName}
                </Typography>
              )}
            </Box>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <TreeStatusBadge sponsorship={tree.sponsorship} />
          </Box>
        </Box>

        <Divider />

        {/* Details */}
        <Stack spacing={1.5}>
          {tree.address && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.2 }} />
              <Typography variant="body2" color="text.secondary">
                {tree.address} {tree.district && `- ${tree.district}`}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {tree.heightM ? (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <HeightIcon fontSize="small" color="action" />
                <Typography variant="body2">{tree.heightM}m</Typography>
              </Stack>
            ) : null}
            {tree.circumferenceCm ? (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <StraightenIcon fontSize="small" color="action" />
                <Typography variant="body2">{tree.circumferenceCm}cm</Typography>
              </Stack>
            ) : null}
            {tree.developmentStage && (
              <Chip label={tree.developmentStage} size="small" variant="outlined" sx={{ height: 24, fontSize: '0.75rem' }} />
            )}
          </Stack>

          {tree.remarkable?.summary && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
              <InfoOutlinedIcon fontSize="small" color="primary" sx={{ mt: 0.2 }} />
              <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.5 }}>
                {tree.remarkable.summary}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Divider />

        {/* Action Section */}
        <Box>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 2.5 }}>
            <Typography variant="body2" color="text.secondary">Valeur estimée</Typography>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
              {formatCredits(currentPrice)}
            </Typography>
          </Stack>

          {isOwner ? (
            <Box sx={{ bgcolor: 'success.light', color: 'success.contrastText', p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Vous êtes le parrain de cet arbre !
              </Typography>
            </Box>
          ) : user ? (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Personnalisez votre arbre
                </Typography>
                <TextField
                  label="Nom (optionnel)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Le Chêne Royal"
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Votre offre
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  helperText={`Minimum requis: ${formatCredits(minBid)}`}
                />
              </Box>

              {error && (
                <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || Number(bidAmount) < minBid}
                onClick={handleBuy}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ParkIcon />}
                sx={{ py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
              >
                {loading ? 'Transaction en cours...' : 'Acquérir cet arbre'}
              </Button>
            </Stack>
          ) : (
            <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Connectez-vous pour parrainer cet arbre et laisser votre empreinte.
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
      </Box>
    </Card>
  );
};
