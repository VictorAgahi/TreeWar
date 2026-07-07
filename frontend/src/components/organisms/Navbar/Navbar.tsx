import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Box, Drawer, Divider, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ForestIcon from '@mui/icons-material/Forest';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from '../../atoms/Typography/Typography';
import { IconButton } from '../../atoms/IconButton/IconButton';
import { NavLinksList } from '../../molecules/NavLinksList/NavLinksList';
import { CompanyBadge } from '../../molecules/CompanyBadge/CompanyBadge';
import type { NavLinkItemProps } from '../../molecules/NavLinkItem/NavLinkItem';
import { useAuth } from '../../../context/AuthContext';

const NAV_LINKS: Array<Pick<NavLinkItemProps, 'to' | 'label' | 'icon'>> = [
  { to: '/map', label: 'Carte', icon: <HomeIcon fontSize="small" /> },
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
  { to: '/profile', label: 'Profil', icon: <PersonIcon fontSize="small" /> },
];

export const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box
            component={RouterLink}
            to="/map"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit', mr: 'auto' }}
          >
            <ForestIcon color="primary" fontSize="large" />
            <Typography variant="h6" component="span" color="text.primary" sx={{ fontWeight: 700 }}>
              TreeWar
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton aria-label="Ouvrir le menu de navigation" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <NavLinksList links={NAV_LINKS} direction="row" />
              {user && <CompanyBadge name={user.username} credits={user.credits} />}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={isMobile && mobileOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton aria-label="Fermer le menu de navigation" onClick={closeMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          {user && (
            <Box sx={{ mb: 2 }}>
              <CompanyBadge name={user.username} credits={user.credits} />
            </Box>
          )}
          <Divider sx={{ mb: 2 }} />
          <NavLinksList links={NAV_LINKS} direction="column" onNavigate={closeMobileMenu} />
        </Box>
      </Drawer>
    </>
  );
};
