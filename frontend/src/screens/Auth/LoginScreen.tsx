import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { AuthTemplate } from '../../components/templates/AuthTemplate/AuthTemplate';
import { FormField } from '../../components/molecules/FormField/FormField';
import { Button } from '../../components/atoms/Button/Button';
import { Typography } from '../../components/atoms/Typography/Typography';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { authApi } from '../../api/auth.api';
import type { LoginResponse } from '../../api/auth.api';

const loginSchema = z.object({
  email: z.string().email("L'email est invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { execute: executeLogin, loading, error: serverError } = useApi<LoginResponse>(
    authApi.login()
  );

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await executeLogin({ data });
      login(result.accessToken);
      navigate('/dashboard');
    } catch {
    }
  };

  return (
    <AuthTemplate
      title="Connexion"
      subtitle="Veuillez vous identifier pour continuer"
      footer={
        <Typography variant="body2">
          Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
        </Typography>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField
          name="email"
          control={control}
          label="Email"
          type="email"
        />
        <FormField
          name="password"
          control={control}
          label="Mot de passe"
          type="password"
        />
        {serverError && <Typography color="error" variant="body2">{serverError}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </form>
    </AuthTemplate>
  );
};
