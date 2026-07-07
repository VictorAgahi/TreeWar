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
    const label = sponsorship.customName
      ? `"${sponsorship.customName}" — parrainé par ${sponsorship.companyName}`
      : `Parrainé par ${sponsorship.companyName}`;
    return <Chip icon={<VerifiedIcon />} label={label} color="secondary" size="small" />;
  }

  return <Chip icon={<ParkIcon />} label="Disponible au parrainage" color="primary" size="small" />;
};
