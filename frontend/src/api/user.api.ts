import type { AxiosRequestConfig } from 'axios';

export interface User {
  id: string;
  email: string;
  username: string;
  credits: number;
}

export interface UpdateUsernameRequest {
  username: string;
}

export const userApi = {
  getMe: (): AxiosRequestConfig => ({
    url: '/user/me',
    method: 'GET',
  }),

  updateUsername: (): AxiosRequestConfig => ({
    url: '/user/username',
    method: 'PATCH',
  }),
};
