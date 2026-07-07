import React from 'react';
import { Container } from '@mui/material';
import { Card } from '../../components/atoms/Card/Card';
import { TreeWarMap } from '../../components/organisms/TreeWarMap/TreeWarMap';

export const MapPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 2, flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Card noPadding sx={{ flex: 1, display: 'flex', width: '100%', height: '100%' }}>
        <TreeWarMap />
      </Card>
    </Container>
  );
};
