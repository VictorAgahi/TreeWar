import type { AxiosRequestConfig } from 'axios';

export interface Transaction {
  id: string;
  action: 'BUY';
  itemType: 'TREE';
  itemId: string;
  itemName: string;
  price: number;
  lat: number;
  lng: number;
  userId: string;
  createdAt: string;
}

export const transactionApi = {
  getMyTransactions: (): AxiosRequestConfig => ({
    url: '/transaction/me',
    method: 'GET',
  }),
};
