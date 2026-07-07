import type { AxiosRequestConfig } from 'axios';
import type { ParisTree } from '../types/tree';

export interface BackendTreeOwner {
  id: string;
  username: string;
}

export interface BackendTree {
  id: string;
  name: string;
  location: { type: 'Point'; coordinates: [number, number] }; // [lng, lat]
  price: number;
  ownerId: string | null;
  owner?: BackendTreeOwner | null;
}

export interface BuyTreeRequest {
  treeId?: string;
  amount: number;
  newName?: string;
  lat: number;
  lng: number;
}

export const treeApi = {
  getAll: (): AxiosRequestConfig => ({
    url: '/tree',
    method: 'GET',
  }),

  buy: (): AxiosRequestConfig => ({
    url: '/tree/buy',
    method: 'PUT',
  }),
};

const coordKey = (lat: number, lon: number) => `${lat.toFixed(5)},${lon.toFixed(5)}`;


export function mergeTreeSponsorships(trees: ParisTree[], backendTrees: BackendTree[]): ParisTree[] {
  const byCoord = new Map<string, BackendTree>();
  for (const backendTree of backendTrees) {
    const [lng, lat] = backendTree.location.coordinates;
    byCoord.set(coordKey(lat, lng), backendTree);
  }

  return trees.map((tree) => {
    const match = byCoord.get(coordKey(tree.lat, tree.lon));
    if (!match) {
      return tree;
    }
    return {
      ...tree,
      name: match.name || tree.name,
      sponsorship: {
        status: 'sponsored',
        companyName: match.owner?.username ?? 'Entreprise',
        customName: match.name,
        dbTreeId: match.id,
        currentPrice: match.price,
        ownerId: match.ownerId ?? undefined,
      },
    };
  });
}
