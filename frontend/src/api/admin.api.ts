import type { AxiosRequestConfig } from 'axios';

export const adminApi = {
  seedDatabase: (): AxiosRequestConfig => ({
    url: '/admin/seed',
    method: 'POST',
  }),
};
