import React from 'react';
import { Box } from '@mui/material';
import { LobbyLayout } from '../../components/templates/LobbyLayout/LobbyLayout';
import { Card } from '../../components/atoms/Card/Card';
import { Typography } from '../../components/atoms/Typography/Typography';
import { JoinLobbyForm } from '../../components/organisms/JoinLobbyForm/JoinLobbyForm';

interface LobbyPageProps {
  onJoinGame: (roomId: string, nickname: string) => void;
}

export const LobbyPage: React.FC<LobbyPageProps> = ({ onJoinGame }) => {
  const handleCreateRoom = (nickname: string) => {
    // For MVP, randomly generate a room code and join
    const newRoomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    onJoinGame(newRoomId, nickname);
  };

  const handleJoinRoom = (roomId: string, nickname: string) => {
    onJoinGame(roomId, nickname);
  };

  return (
    <LobbyLayout>
      <Card>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" color="primary" gutterBottom>
            TreeWar
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome! Plant trees to cool the city, but beware of the Mayor's sabotage.
          </Typography>
        </Box>
        <JoinLobbyForm onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
      </Card>
    </LobbyLayout>
  );
};
