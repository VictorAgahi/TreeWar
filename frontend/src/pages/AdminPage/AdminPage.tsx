import React, { useState } from 'react';
import { Container, Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { axiosClient } from '../../api/axiosClient';
import { adminApi } from '../../api/admin.api';

export const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    if (!window.confirm('Attention ! Cette action va effacer toute la base de données actuelle pour la remplacer par des données de test. Es-tu sûr ?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await axiosClient.request(adminApi.seedDatabase());
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors du seed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Administration 🛠️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Espace réservé à l&apos;administration du jeu TreeWar.
        </Typography>
      </Box>

      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h5" gutterBottom>
          Générateur de Monde (Seed)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Cet outil permet de générer de faux profils (Takima, Google, etc.), de leur attribuer des crédits et de simuler des achats d&apos;arbres à travers Paris pour rendre le classement réaliste.
        </Typography>
        
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 3 }}>
          <strong>Action destructrice</strong> : Toutes les données existantes (utilisateurs, arbres, transactions) seront supprimées avant le seed.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            La base de données a été repeuplée avec succès ! Tu peux retourner sur le Dashboard.
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="error" 
            size="large"
            onClick={handleSeed}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Création du monde en cours...' : 'Lancer le Seed'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
