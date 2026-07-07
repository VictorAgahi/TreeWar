import React from 'react';
import { Box, Chip, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ParkIcon from '@mui/icons-material/Park';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { TreeStatusBadge } from '../../atoms/TreeStatusBadge/TreeStatusBadge';
import type { ParisTree } from '../../../types/tree';

export interface TreeInfoPanelProps {
  tree: ParisTree;
  onClose: () => void;
}

export const TreeInfoPanel: React.FC<TreeInfoPanelProps> = ({ tree, onClose }) => {
  const { remarkable } = tree;

  return (
    <Card
      noPadding={!!remarkable?.photoUrl}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 320,
        maxHeight: 'calc(100% - 32px)',
        overflowY: 'auto',
        zIndex: 1000,
      }}
    >
      {remarkable?.photoUrl && (
        <Box
          component="img"
          src={remarkable.photoUrl}
          alt={tree.name}
          sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
        />
      )}

      <Box sx={{ p: remarkable?.photoUrl ? 2 : 0 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {remarkable ? <AutoAwesomeIcon sx={{ color: '#c98a1f' }} /> : <ParkIcon color="primary" />}
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

        {remarkable && (
          <Stack spacing={1} sx={{ mb: 1.5 }}>
            {remarkable.qualification && <Chip label={remarkable.qualification} size="small" color="warning" />}
            {(remarkable.summary || remarkable.description) && (
              <Typography variant="body2">{remarkable.summary || remarkable.description}</Typography>
            )}
            {remarkable.label && (
              <Typography variant="caption" color="text.secondary">
                Label : {remarkable.label}
              </Typography>
            )}
            {remarkable.photoCredit && (
              <Typography variant="caption" color="text.disabled">
                Photo : {remarkable.photoCredit}
              </Typography>
            )}
          </Stack>
        )}

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
          {tree.heightM !== null && <Typography variant="body2">Hauteur : {tree.heightM} m</Typography>}
          {tree.circumferenceCm !== null && (
            <Typography variant="body2">Circonférence : {tree.circumferenceCm} cm</Typography>
          )}
          {tree.developmentStage && <Typography variant="body2">Stade : {tree.developmentStage}</Typography>}
        </Stack>
      </Box>
    </Card>
  );
};
