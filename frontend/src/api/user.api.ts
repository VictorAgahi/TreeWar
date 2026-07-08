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

export interface LeaderboardUser {
  id: string;
  username: string;
  totalValue?: number;
  maxTreePrice?: number;
  maxTreeId?: string;
  treeCount?: number;
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

  getLeaderboardTotalValue: (limit?: number): AxiosRequestConfig => ({
    url: limit ? `/user/leaderboard/total-value?limit=${limit}` : '/user/leaderboard/total-value',
    method: 'GET',
  }),

  getLeaderboardMostTrees: (limit?: number): AxiosRequestConfig => ({
    url: limit ? `/user/leaderboard/most-trees?limit=${limit}` : '/user/leaderboard/most-trees',
    method: 'GET',
  }),

  getLeaderboardMostExpensiveTree: (limit?: number): AxiosRequestConfig => ({
    url: limit ? `/user/leaderboard/most-expensive-tree?limit=${limit}` : '/user/leaderboard/most-expensive-tree',
    method: 'GET',
  }),

  topup: (): AxiosRequestConfig => ({
    url: '/user/topup',
    method: 'POST',
  }),
};
