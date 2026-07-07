import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/atoms/Button/Button';
import { Typography } from '../../components/atoms/Typography/Typography';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '24px' }}>
      <Typography variant="h2">Bienvenue sur TreeWar</Typography>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')} size="large">
          Se connecter
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/register')} size="large">
          S'inscrire
        </Button>
      </div>
    </div>
  );
};
