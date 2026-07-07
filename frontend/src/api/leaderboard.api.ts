import type { AxiosRequestConfig } from 'axios';

export interface LeaderboardEntry {
  id: string;
  username: string;
  totalValue: number;
}

export const leaderboardApi = {
  totalValue: (): AxiosRequestConfig => ({
    url: '/user/leaderboard/total-value',
    method: 'GET',
  }),
};
