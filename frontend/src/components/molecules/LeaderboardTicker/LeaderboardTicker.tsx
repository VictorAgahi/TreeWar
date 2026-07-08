import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import ParkIcon from '@mui/icons-material/Park';
import { axiosClient } from '../../../api/axiosClient';
import { userApi, type LeaderboardUser } from '../../../api/user.api';
import { formatCredits } from '../../../utils/format';

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export const LeaderboardTicker: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    axiosClient.request<LeaderboardUser[]>(userApi.getLeaderboardMostExpensiveTree(10))
      .then(res => setLeaders(res.data))
      .catch(console.error);
  }, []);

  if (leaders.length === 0) return null;

  const top1 = leaders[0];
  const others = leaders.slice(1);

  const renderOthers = () => {
    if (others.length === 0) return null;
    return (
      <Box sx={{ display: 'flex', gap: 4, pr: 4 }}>
        {others.map((leader, index) => (
          <Box key={leader.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#FFD700' }}>
              TOP {index + 2}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              {leader.username}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', opacity: 0.9 }}>
              — {formatCredits(leader.maxTreePrice ?? 0)}
              <ParkIcon sx={{ fontSize: 16, ml: 0.5, color: '#A5D6A7' }} />
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{
      width: '100%',
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid',
      borderColor: 'primary.dark',
      minHeight: 36,
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        px: 2, 
        py: 0.75,
        borderRight: '1px solid', 
        borderColor: 'primary.dark',
        bgcolor: 'primary.main',
        zIndex: 2,
        boxShadow: '4px 0 8px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#FFD700', whiteSpace: 'nowrap' }}>
          TOP 1
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>
          {top1.username}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', opacity: 0.9, whiteSpace: 'nowrap' }}>
          — {formatCredits(top1.maxTreePrice ?? 0)}
          <ParkIcon sx={{ fontSize: 16, ml: 0.5, color: '#A5D6A7' }} />
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', py: 0.75 }}>
        <Box sx={{
          display: 'flex',
          width: 'max-content',
          animation: `${marquee} 40s linear infinite`,
        }}>
          {renderOthers()}
          {renderOthers()}
          {renderOthers()}
          {renderOthers()}
        </Box>
      </Box>
    </Box>
  );
};
