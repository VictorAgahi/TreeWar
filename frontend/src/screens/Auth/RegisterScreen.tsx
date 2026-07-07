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
import type { RegisterResponse, LoginResponse } from '../../api/auth.api';

const registerSchema = z.object({
  email: z.string().email("L'email est invalide").min(1, "L'email est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterScreen: React.FC = () => {
  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { execute: executeRegister, loading: loadingRegister, error: registerError } = useApi<RegisterResponse>(
    authApi.register()
  );

  const { execute: executeLogin, loading: loadingLogin, error: loginError } = useApi<LoginResponse>(
    authApi.login()
  );

  const serverError = registerError || loginError;
  const isLoading = loadingRegister || loadingLogin;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await executeRegister({ data });
      const loginResult = await executeLogin({ data });
      
      login(loginResult.accessToken);
      navigate('/dashboard');
    } catch (err) {
      // L'erreur est déjà captée par les hooks
    }
  };

  return (
    <AuthTemplate
      title="Inscription"
      subtitle="Créez votre compte pour commencer"
      footer={
        <Typography variant="body2">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
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
        <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={isLoading}>
          {isLoading ? 'Inscription...' : "S'inscrire"}
        </Button>
      </form>
    </AuthTemplate>
  );
};
