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

  const matchedKeys = new Set<string>();

  const merged = trees.map((tree) => {
    const key = coordKey(tree.lat, tree.lon);
    const match = byCoord.get(key);
    if (!match) {
      return tree;
    }
    matchedKeys.add(key);
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
    } as ParisTree;
  });

  // Append backend trees that didn't match any Open Data tree (e.g., from seed or coordinate drift)
  for (const backendTree of backendTrees) {
    const [lng, lat] = backendTree.location.coordinates;
    const key = coordKey(lat, lng);
    if (!matchedKeys.has(key)) {
      merged.push({
        id: `custom-${backendTree.id}`,
        name: backendTree.name || 'Arbre',
        genus: 'Inconnu',
        species: 'Inconnu',
        address: 'Inconnue',
        district: "1", // Fallback
        heightM: null,
        circumferenceCm: null,
        developmentStage: 'Inconnu',
        lat,
        lon: lng,
        remarkable: null,
        sponsorship: {
          status: 'sponsored',
          companyName: backendTree.owner?.username ?? 'Entreprise',
          customName: backendTree.name,
          dbTreeId: backendTree.id,
          currentPrice: backendTree.price,
          ownerId: backendTree.ownerId ?? undefined,
        },
      });
    }
  }

  return merged;
}
