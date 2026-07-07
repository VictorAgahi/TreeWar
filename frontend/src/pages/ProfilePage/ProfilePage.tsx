import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container, Stack, Box, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import { Card } from '../../components/atoms/Card/Card';
import { Typography } from '../../components/atoms/Typography/Typography';
import { Avatar } from '../../components/atoms/Avatar/Avatar';
import { Button } from '../../components/atoms/Button/Button';
import { FormField } from '../../components/molecules/FormField/FormField';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { userApi } from '../../api/user.api';
import type { User } from '../../api/user.api';

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Le pseudo doit faire au moins 3 caractères')
    .max(20, 'Le pseudo ne peut pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le pseudo ne peut contenir que des lettres, chiffres et underscores'),
});

type UsernameFormData = z.infer<typeof usernameSchema>;

const EditUsernameDialog: React.FC<{
  open: boolean;
  currentUsername: string;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}> = ({ open, currentUsername, onClose, onUpdated }) => {
  const { control, handleSubmit, reset } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: currentUsername },
  });
  const { execute: executeUpdate, loading, error: serverError } = useApi<User>(userApi.updateUsername());

  const handleClose = () => {
    reset({ username: currentUsername });
    onClose();
  };

  const onSubmit = async (data: UsernameFormData) => {
    await executeUpdate({ data });
    await onUpdated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Modifier le profil</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormField name="username" control={control} label="Pseudo" />
            {serverError && (
              <Typography color="error" variant="body2">
                {serverError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const ProfilePage: React.FC = () => {
  const { user, isLoadingUser, refreshUser, logout } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoadingUser || !user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, flex: 1 }}>
        <Card>
          <Typography variant="body2" color="text.secondary">
            Chargement du profil...
          </Typography>
        </Card>
      </Container>
    );
  }

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <Container maxWidth="sm" sx={{ py: 4, flex: 1 }}>
      <Card>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 24 }}>{initials}</Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.username}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {user.credits.toLocaleString('fr-FR')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Crédits
            </Typography>
          </Box>

          <Button variant="outlined" color="primary" onClick={() => setIsEditDialogOpen(true)}>
            Modifier le profil
          </Button>

          <Button variant="outlined" color="error" onClick={logout} startIcon={<LogoutIcon />}>
            Se déconnecter
          </Button>
        </Stack>
      </Card>

      <EditUsernameDialog
        open={isEditDialogOpen}
        currentUsername={user.username}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdated={refreshUser}
      />
    </Container>
  );
};
