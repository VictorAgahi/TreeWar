import { useState, useCallback } from 'react';
import type { AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { axiosClient } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface UseApiResponse<TOut> {
  data: TOut | null;
  loading: boolean;
  error: string | null;
  execute: (config?: AxiosRequestConfig) => Promise<TOut>;
}

export function useApi<TOut = unknown>(defaultConfig: AxiosRequestConfig): UseApiResponse<TOut> {
  const [data, setData] = useState<TOut | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig): Promise<TOut> => {
      setLoading(true);
      setError(null);
      try {
        const finalConfig: AxiosRequestConfig = {
          ...defaultConfig,
          ...overrideConfig,
          headers: {
            ...defaultConfig.headers,
            ...(overrideConfig?.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        };

        const response = await axiosClient.request<TOut>(finalConfig);
        setData(response.data);
        return response.data;
      } catch (err) {
        let errorMsg = 'Une erreur est survenue';
        if (err instanceof AxiosError) {
          errorMsg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          errorMsg = err.message;
        }
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [defaultConfig, token]
  );

  return { data, loading, error, execute };
}
