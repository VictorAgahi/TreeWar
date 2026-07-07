import React from 'react';
import { Box, Avatar } from '@mui/material';
import { Typography } from '../../atoms/Typography/Typography';

interface PlayerAvatarProps {
  name: string;
  isMayor?: boolean;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ name, isMayor }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ bgcolor: isMayor ? 'secondary.main' : 'primary.main', width: 56, height: 56 }}>
        {name.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {name}
      </Typography>
    </Box>
  );
};
