import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { axiosClient } from '../api/axiosClient';
import { userApi } from '../api/user.api';
import type { User } from '../api/user.api';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const fetchUser = useCallback(async (currentToken: string) => {
    setIsLoadingUser(true);
    try {
      const { url, method } = userApi.getMe();
      const response = await axiosClient.request<User>({
        url,
        method,
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUser(response.data);
    } catch {
      // Token invalide ou expiré : on revient à l'état déconnecté.
      setToken(null);
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void fetchUser(token);
    } else {
      setUser(null);
    }
  }, [token, fetchUser]);

  const login = (newToken: string) => setToken(newToken);
  const logout = () => setToken(null);

  const refreshUser = useCallback(async () => {
    if (token) {
      await fetchUser(token);
    }
  }, [token, fetchUser]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, isLoadingUser, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
