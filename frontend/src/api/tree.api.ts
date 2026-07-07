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

const coordKey = (lat: number, lon: number) => `${lat.toFixed(6)},${lon.toFixed(6)}`;

// The backend only knows about trees that have already been sponsored — it has no
// notion of the open-data catalog. We correlate the two by exact coordinate match
// (both sides use the same lat/lng, so no tolerance needed).
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
