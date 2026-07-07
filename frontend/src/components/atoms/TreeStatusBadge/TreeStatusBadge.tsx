import React from 'react';
import { Chip } from '@mui/material';
import ParkIcon from '@mui/icons-material/Park';
import VerifiedIcon from '@mui/icons-material/Verified';
import type { TreeSponsorship } from '../../../types/tree';

export interface TreeStatusBadgeProps {
  sponsorship: TreeSponsorship;
}

export const TreeStatusBadge: React.FC<TreeStatusBadgeProps> = ({ sponsorship }) => {
  if (sponsorship.status === 'sponsored') {
    return (
      <Chip
        icon={<VerifiedIcon />}
        label={`Parrainé par ${sponsorship.sponsorName}`}
        color="secondary"
        size="small"
      />
    );
  }

  return <Chip icon={<ParkIcon />} label="Disponible au parrainage" color="primary" size="small" />;
};
