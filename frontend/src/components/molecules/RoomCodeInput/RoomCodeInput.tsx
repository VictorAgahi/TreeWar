import React from 'react';
import { Box } from '@mui/material';
import { TextField } from '../../atoms/TextField/TextField';
import { Button } from '../../atoms/Button/Button';

interface RoomCodeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onJoin: () => void;
  disabled?: boolean;
}

export const RoomCodeInput: React.FC<RoomCodeInputProps> = ({ value, onChange, onJoin, disabled }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        label="Room Code"
        variant="outlined"
        value={value}
        onChange={onChange}
        disabled={disabled}
        slotProps={{ htmlInput: { maxLength: 4, style: { textTransform: 'uppercase', textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold' } } }}
      />
      <Button variant="contained" color="primary" onClick={onJoin} disabled={disabled || value.length !== 4}>
        Join
      </Button>
    </Box>
  );
};
