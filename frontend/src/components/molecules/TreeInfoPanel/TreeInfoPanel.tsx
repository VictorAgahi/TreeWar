import React from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ParkIcon from '@mui/icons-material/Park';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeStatusBadge } from '../../atoms/TreeStatusBadge/TreeStatusBadge';
import type { ParisTree } from '../../../types/tree';

export interface TreeInfoPanelProps {
  tree: ParisTree;
  onClose: () => void;
}

export const TreeInfoPanel: React.FC<TreeInfoPanelProps> = ({ tree, onClose }) => {
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

      <Stack spacing={0.5}>
        {tree.address && (
          <Typography variant="body2" color="text.secondary">
            {tree.address}
          </Typography>
        )}
        {tree.district && (
          <Typography variant="body2" color="text.secondary">
            {tree.district}
          </Typography>
        )}
        {tree.heightM !== null && (
          <Typography variant="body2">Hauteur : {tree.heightM} m</Typography>
        )}
        {tree.circumferenceCm !== null && (
          <Typography variant="body2">Circonférence : {tree.circumferenceCm} cm</Typography>
        )}
        {tree.developmentStage && (
          <Typography variant="body2">Stade : {tree.developmentStage}</Typography>
        )}
        {tree.remarkable && (
          <Typography variant="body2" color="secondary" sx={{ fontWeight: 600 }}>
            Arbre remarquable
          </Typography>
        )}
      </Stack>
    </Card>
  );
};
