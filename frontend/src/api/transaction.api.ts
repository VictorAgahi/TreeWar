import type { AxiosRequestConfig } from 'axios';

export interface Transaction {
  id: string;
  action: 'BUY' | 'RECHARGE';
  itemType: 'TREE' | 'CREDITS';
  itemId: string;
  itemName: string;
  price: number;
  lat: number;
  lng: number;
  userId: string;
  createdAt: string;
}

export interface TransactionStats {
  totalCredits: number;
  totalTrees: number;
}

export const transactionApi = {
  getMyTransactions: (): AxiosRequestConfig => ({
    url: '/transaction/me',
    method: 'GET',
  }),
  getTotalStats: (): AxiosRequestConfig => ({
    url: '/transaction/stats',
    method: 'GET',
  }),
};
