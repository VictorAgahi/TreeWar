import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button } from '../../atoms/Button/Button';

export interface NavLinkItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}

export const NavLinkItem: React.FC<NavLinkItemProps> = ({ to, label, icon, onClick, fullWidth = false }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Button
      component={RouterLink}
      to={to}
      onClick={onClick}
      startIcon={icon}
      fullWidth={fullWidth}
      variant={isActive ? 'contained' : 'text'}
      color={isActive ? 'primary' : 'inherit'}
      sx={{
        justifyContent: fullWidth ? 'flex-start' : 'center',
        color: isActive ? undefined : 'text.secondary',
      }}
    >
      {label}
    </Button>
  );
};
