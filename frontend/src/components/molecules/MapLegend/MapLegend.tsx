import React from 'react';
import { Box, Stack } from '@mui/material';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { TREE_MARKER_COLORS } from '../../organisms/ParisTreeMap/treeMarkerColors';

export const MapLegend: React.FC = () => {
  return (
    <Card
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        zIndex: 1000,
        px: 2,
        py: 1.5,
      }}
    >
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: TREE_MARKER_COLORS.normal }} />
          <Typography variant="body2">Arbre disponible au parrainage</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: TREE_MARKER_COLORS.sponsored }} />
          <Typography variant="body2">Arbre parrainé</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              bgcolor: TREE_MARKER_COLORS.remarkable,
              border: '2px solid white',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
            }}
          />
          <Typography variant="body2">Arbre remarquable</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
