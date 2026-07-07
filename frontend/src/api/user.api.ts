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

  getLeaderboardTotalValue: (): AxiosRequestConfig => ({
    url: '/user/leaderboard/total-value',
    method: 'GET',
  }),

  getLeaderboardMostTrees: (): AxiosRequestConfig => ({
    url: '/user/leaderboard/most-trees',
    method: 'GET',
  }),

  getLeaderboardMostExpensiveTree: (): AxiosRequestConfig => ({
    url: '/user/leaderboard/most-expensive-tree',
    method: 'GET',
  }),
};
