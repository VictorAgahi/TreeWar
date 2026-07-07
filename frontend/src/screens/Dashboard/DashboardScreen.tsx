import React from 'react';
import { DashboardTemplate } from '../../components/templates/DashboardTemplate/DashboardTemplate';
import { Typography } from '../../components/atoms/Typography/Typography';

export const DashboardScreen: React.FC = () => {
  return (
    <DashboardTemplate title="Tableau de bord">
      <Typography variant="h4" gutterBottom>
        Bienvenue sur votre espace connecté !
      </Typography>
      <Typography variant="body1">
        Vous êtes correctement authentifié grâce à votre token JWT stocké de manière sécurisée.
      </Typography>
    </DashboardTemplate>
  );
};
