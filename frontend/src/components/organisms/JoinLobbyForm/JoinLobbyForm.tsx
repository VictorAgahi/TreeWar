import React, { useState } from 'react';
import { Box, Divider } from '@mui/material';
import { Button } from '../../atoms/Button/Button';
import { TextField } from '../../atoms/TextField/TextField';
import { Typography } from '../../atoms/Typography/Typography';
import { RoomCodeInput } from '../../molecules/RoomCodeInput/RoomCodeInput';

interface JoinLobbyFormProps {
  onCreateRoom: (nickname: string) => void;
  onJoinRoom: (roomId: string, nickname: string) => void;
}

export const JoinLobbyForm: React.FC<JoinLobbyFormProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleCreate = () => {
    if (nickname) onCreateRoom(nickname);
  };

  const handleJoin = () => {
    if (nickname && roomId.length === 4) onJoinRoom(roomId.toUpperCase(), nickname);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Your Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleCreate}
        disabled={!nickname}
        fullWidth
      >
        Create New Game
      </Button>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography variant="body2" color="textSecondary">OR</Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      <RoomCodeInput
        value={roomId}
        onChange={(e) => setRoomId(e.target.value.toUpperCase().slice(0, 4))}
        onJoin={handleJoin}
        disabled={!nickname}
      />
    </Box>
  );
};
