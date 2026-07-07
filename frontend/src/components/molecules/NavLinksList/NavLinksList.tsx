import React from 'react';
import { Stack } from '@mui/material';
import { NavLinkItem } from '../NavLinkItem/NavLinkItem';
import type { NavLinkItemProps } from '../NavLinkItem/NavLinkItem';

export interface NavLinksListProps {
  links: Array<Pick<NavLinkItemProps, 'to' | 'label' | 'icon'>>;
  direction?: 'row' | 'column';
  onNavigate?: () => void;
}

export const NavLinksList: React.FC<NavLinksListProps> = ({ links, direction = 'row', onNavigate }) => {
  return (
    <Stack
      direction={direction}
      spacing={direction === 'row' ? 1 : 0.5}
      sx={{ alignItems: direction === 'row' ? 'center' : 'stretch' }}
    >
      {links.map((link) => (
        <NavLinkItem key={link.to} {...link} onClick={onNavigate} fullWidth={direction === 'column'} />
      ))}
    </Stack>
  );
};
