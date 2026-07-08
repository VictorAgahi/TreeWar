import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Stack, alpha, useTheme } from '@mui/material';
import ForestIcon from '@mui/icons-material/Forest';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';

interface AuthTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0)} 45%)`,
      }}
    >
      <Container maxWidth="sm" sx={{ pt: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'center' }}>
        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', width: 'fit-content', textDecoration: 'none', color: 'inherit' }}
        >
          <ForestIcon color="primary" fontSize="large" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            InvesTree
          </Typography>
        </Stack>
      </Container>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4 }}>
        <Card sx={{ width: '100%', maxWidth: 440, '& .MuiCardContent-root': { p: { xs: 3, sm: 5 } } }}>
          <Stack spacing={0.5} sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
          {children}
          {footer && <Box sx={{ mt: 3, textAlign: 'center' }}>{footer}</Box>}
        </Card>
      </Box>
    </Box>
  );
};
