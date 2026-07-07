import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Stack, alpha, useTheme } from '@mui/material';
import ForestIcon from '@mui/icons-material/Forest';
import ParkIcon from '@mui/icons-material/Park';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PlaceIcon from '@mui/icons-material/Place';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PaidIcon from '@mui/icons-material/Paid';
import MapIcon from '@mui/icons-material/Map';
import { Card } from '../../components/atoms/Card/Card';
import { Chip } from '../../components/atoms/Chip/Chip';
import { Typography } from '../../components/atoms/Typography/Typography';
import { Button } from '../../components/atoms/Button/Button';
import { useAuth } from '../../context/AuthContext';

const FEATURES = [
  {
    icon: <ParkIcon sx={{ fontSize: 32 }} />,
    title: 'Sponsorisez des arbres réels',
    description: 'Chaque arbre affiché sur la carte correspond à un vrai arbre planté dans les rues de Paris.',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
    title: 'Grimpez au classement',
    description: 'Accumulez des arbres et des crédits pour faire grimper votre entreprise en tête du classement.',
  },
  {
    icon: <PlaceIcon sx={{ fontSize: 32 }} />,
    title: 'Carte interactive en temps réel',
    description: 'Explorez, enchérissez et suivez vos arbres sur une carte de Paris mise à jour en direct.',
  },
];

const HeroMockup: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 420, mx: 'auto' }}>
      <Box
        sx={{
          borderRadius: 6,
          p: 5,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: `0px 24px 48px ${alpha(theme.palette.primary.main, 0.35)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1 / 1',
        }}
      >
        <ForestIcon sx={{ fontSize: 140, color: alpha('#ffffff', 0.9) }} />
      </Box>

      <Card
        sx={{
          position: 'absolute',
          top: -16,
          right: -20,
          borderRadius: 3,
          boxShadow: theme.shadows[6],
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.secondary.main, 0.12),
              color: 'secondary.main',
              flexShrink: 0,
            }}
          >
            <MilitaryTechIcon fontSize="small" />
          </Box>
          <Stack spacing={0}>
            <Typography variant="caption" color="text.secondary">
              Votre rang
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              #1 au classement
            </Typography>
          </Stack>
        </Stack>
      </Card>

      <Card
        sx={{
          position: 'absolute',
          bottom: -20,
          left: -24,
          borderRadius: 3,
          boxShadow: theme.shadows[6],
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            <PaidIcon fontSize="small" />
          </Box>
          <Stack spacing={0}>
            <Typography variant="caption" color="text.secondary">
              Crédits disponibles
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              3 000 crédits
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export const LandingScreen: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <ForestIcon color="primary" fontSize="large" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                TreeWar
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5}>
              {isAuthenticated ? (
                <Button component={RouterLink} to="/dashboard" variant="contained" color="primary">
                  Accéder à mon espace
                </Button>
              ) : (
                <>
                  <Button component={RouterLink} to="/login" variant="text" color="primary">
                    Se connecter
                  </Button>
                  <Button component={RouterLink} to="/register" variant="contained" color="primary">
                    Créer un compte
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0)} 60%)`,
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 6, md: 4 }}
            sx={{ alignItems: 'center' }}
          >
            <Stack spacing={3} sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Chip
                label="Le jeu de territoire écologique"
                color="primary"
                variant="outlined"
                size="small"
                sx={{ alignSelf: { xs: 'center', md: 'flex-start' }, fontWeight: 600 }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Parainez les arbres de Paris.
                <Box component="span" sx={{ color: 'primary.main' }}>
                  {' '}
                  Dominez le classement.
                </Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Parainez des arbres réels, faites grandir votre empreinte verte et propulsez votre
                entreprise en tête du classement TreeWar.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                useFlexGap
                sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, pt: 1 }}
              >
                {isAuthenticated ? (
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ flexShrink: 0 }}
                  >
                    Accéder à mon espace
                  </Button>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ flexShrink: 0 }}
                    >
                      Créer un compte gratuitement
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
                      color="primary"
                      size="large"
                      sx={{
                        flexShrink: 0,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                    >
                      Se connecter
                    </Button>
                  </>
                )}
                <Button
                  component={RouterLink}
                  to="/map"
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<MapIcon />}
                  sx={{
                    flexShrink: 0,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  Voir la carte
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', py: { xs: 2, md: 0 } }}>
              <HeroMockup />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack spacing={1} sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Pourquoi jouer à TreeWar ?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Un impact réel, une compétition stratégique, une carte vivante.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {FEATURES.map((feature) => (
              <Card key={feature.title} sx={{ flex: 1 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 8, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
              Prêt à planter votre empreinte ?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 480 }}>
              Rejoignez TreeWar en quelques secondes et commencez à sponsoriser vos premiers arbres dès aujourd'hui.
            </Typography>
            <Button
              component={RouterLink}
              to={isAuthenticated ? "/dashboard" : "/register"}
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                '&:hover': { bgcolor: alpha('#ffffff', 0.9) },
              }}
            >
              {isAuthenticated ? "Accéder à mon espace" : "Créer un compte gratuitement"}
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <ForestIcon color="primary" fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                TreeWar
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              © 2026 TreeWar. Fait avec 🌳 à Paris.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
