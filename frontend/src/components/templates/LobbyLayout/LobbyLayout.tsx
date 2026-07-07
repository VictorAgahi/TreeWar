import React from 'react';
import { Box, Container } from '@mui/material';

interface LobbyLayoutProps {
  children: React.ReactNode;
}

export const LobbyLayout: React.FC<LobbyLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        {children}
      </Container>
    </Box>
  );
};
