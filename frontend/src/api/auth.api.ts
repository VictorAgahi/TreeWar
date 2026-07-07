import type { AxiosRequestConfig } from 'axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export const authApi = {
  login: (): AxiosRequestConfig => ({
    url: '/user/login',
    method: 'POST',
  }),

  register: (): AxiosRequestConfig => ({
    url: '/user/register',
    method: 'POST',
  }),
};
