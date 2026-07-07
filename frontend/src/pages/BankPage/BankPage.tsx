import React, { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, CardActions,
  Button, useTheme, alpha, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Alert
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useAuth } from '../../context/AuthContext';
import { axiosClient } from '../../api/axiosClient';
import { userApi } from '../../api/user.api';
import { formatCredits } from '../../utils/format';

const PACKAGES = [
  { id: 1, credits: 500, price: 5, popular: false, promo: null, originalPrice: null },
  { id: 2, credits: 2000, price: 15, popular: false, promo: null, originalPrice: null },
  { id: 3, credits: 5000, price: 30, popular: true, promo: '-50%', originalPrice: 60 },
  { id: 4, credits: 20000, price: 99, popular: false, promo: 'Offre Limitée !', originalPrice: 240 },
  { id: 5, credits: 100000, price: 399, popular: false, promo: 'Super Deal', originalPrice: 1200 },
  { id: 6, credits: 1000000, price: 1999, popular: false, promo: 'MEILLEURE OFFRE', originalPrice: 10000 },
];

export const BankPage: React.FC = () => {
  const theme = useTheme();
  const { user, refreshUser } = useAuth();
  
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');

  const handleSelectPackage = (pkg: typeof PACKAGES[0]) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
    setSuccess(false);
    setError(null);
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('123');
  };

  const handlePayment = async () => {
    if (!selectedPackage) return;
    if (cardNumber.length < 15 || expiry.length < 5 || cvc.length < 3) {
      setError('Veuillez remplir correctement les informations de la carte.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await axiosClient.request({
        ...userApi.topup(),
        data: { amount: selectedPackage.credits }
      });

      await refreshUser();
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <AccountBalanceWalletIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Banque TreeWar
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 'sm', mx: 'auto', mb: 1 }}>
          Rechargez votre compte pour investir dans plus d'arbres et dominer le marché.
          Solde actuel : <b>{formatCredits(user?.credits || 0)}</b>
        </Typography>
        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, bgcolor: alpha(theme.palette.success.main, 0.1), px: 2, py: 0.5, borderRadius: 2 }}>
          99% de votre depot sont reversés à une association pour planter de vrais arbres.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
        {PACKAGES.map((pkg) => (
          <Card 
            key={pkg.id}
            sx={{ 
              position: 'relative',
              overflow: 'visible',
              border: '2px solid',
              borderColor: pkg.popular ? 'primary.main' : 'divider',
              transform: pkg.popular ? 'scale(1.05)' : 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: pkg.popular ? 'scale(1.08)' : 'scale(1.03)' }
            }}
          >
            {pkg.popular && (
              <Box sx={{
                position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                bgcolor: 'primary.main', color: 'primary.contrastText', px: 2, py: 0.5,
                borderRadius: 4, fontSize: '0.875rem', fontWeight: 700
              }}>
                Le plus populaire
              </Box>
            )}
            {pkg.promo && (
              <Box sx={{
                position: 'absolute', top: pkg.popular ? -30 : -16, right: -10, transform: 'rotate(15deg)',
                bgcolor: 'error.main', color: 'error.contrastText', px: 1.5, py: 0.5,
                borderRadius: 2, fontSize: '0.8rem', fontWeight: 900, boxShadow: 3, zIndex: 1
              }}>
                {pkg.promo}
              </Box>
            )}
            <CardContent sx={{ textAlign: 'center', pt: 5, pb: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                {pkg.credits.toLocaleString('fr-FR')}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Crédits
              </Typography>
              <Typography variant="h5" sx={{ mt: 3, fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                {pkg.originalPrice && (
                  <Typography component="span" variant="body1" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                    {pkg.originalPrice} €
                  </Typography>
                )}
                {pkg.price} €
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0 }}>
              <Button 
                variant={pkg.popular ? "contained" : "outlined"} 
                color="primary" 
                fullWidth 
                size="large"
                onClick={() => handleSelectPackage(pkg)}
              >
                Acheter
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={isModalOpen} onClose={() => !isProcessing && setIsModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon color="primary" />
          Paiement Sécurisé
        </DialogTitle>
        <DialogContent>
          {success ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Paiement réussi ! {selectedPackage?.credits} crédits ont été ajoutés à votre compte.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Achat de <b>{selectedPackage?.credits} crédits</b> pour <b>{selectedPackage?.price} €</b>.
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}

              <TextField 
                label="Numéro de carte" 
                placeholder="4242 4242 4242 4242"
                fullWidth 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  label="Expiration" 
                  placeholder="MM/AA" 
                  fullWidth 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
                <TextField 
                  label="CVC" 
                  placeholder="123" 
                  fullWidth 
                  type="password"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          {!success && (
            <>
              <Button onClick={() => setIsModalOpen(false)} disabled={isProcessing}>
                Annuler
              </Button>
              <Button 
                variant="contained" 
                onClick={handlePayment} 
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} /> : undefined}
              >
                {isProcessing ? 'Traitement...' : `Payer ${selectedPackage?.price} €`}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};
