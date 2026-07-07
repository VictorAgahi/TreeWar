import type { SponsoredTree } from '../../types/dashboard.types';
import type { Transaction } from '../../api/transaction.api';
import type { LeaderboardUser } from '../../api/user.api';
import type { BackendTree } from '../../api/tree.api';
import type { ParisTree } from '../../types/tree';

// ─── Monthly spend ────────────────────────────────────────────────────────────

export interface MonthlySpend {
  month: string;
  spend: number;
}

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export const getMonthlySpend = (transactions: Transaction[]): MonthlySpend[] => {
  const map: Record<string, number> = {};
  for (const tx of transactions) {
    const d = new Date(tx.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    map[key] = (map[key] ?? 0) + tx.price;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, spend]) => {
      const monthIdx = Number(key.split('-')[1]);
      return { month: MONTH_LABELS[monthIdx], spend };
    });
};

// ─── Budget breakdown ─────────────────────────────────────────────────────────

export interface BudgetBreakdown {
  name: string;
  value: number;
  color: string;
}

export const getBudgetBreakdown = (totalInvested: number, creditsRemaining: number): BudgetBreakdown[] => [
  { name: 'Crédits dépensés', value: totalInvested, color: '#2e7d32' },
  { name: 'Crédits restants', value: creditsRemaining, color: '#4caf50' },
];

// ─── Price distribution ───────────────────────────────────────────────────────

export interface PriceRange {
  range: string;
  count: number;
}

export const getPriceDistribution = (trees: SponsoredTree[]): PriceRange[] => {
  const buckets: Record<string, number> = { '< 200': 0, '200-500': 0, '500-1k': 0, '1k-2k': 0, '> 2k': 0 };
  for (const t of trees) {
    if (t.pricePaid < 200) buckets['< 200']++;
    else if (t.pricePaid < 500) buckets['200-500']++;
    else if (t.pricePaid < 1000) buckets['500-1k']++;
    else if (t.pricePaid < 2000) buckets['1k-2k']++;
    else buckets['> 2k']++;
  }
  return Object.entries(buckets).map(([range, count]) => ({ range, count }));
};

// ─── Weekly velocity ──────────────────────────────────────────────────────────

export interface WeeklyVelocity {
  week: string;
  achats: number;
  credits: number;
}

export const getWeeklyVelocity = (transactions: Transaction[]): WeeklyVelocity[] => {
  const now = Date.now();
  const weeks: WeeklyVelocity[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = now - i * 7 * 86400_000;
    const end = start + 7 * 86400_000;
    const label = i === 0 ? 'Actuelle' : `S-${i}`;
    const txInWeek = transactions.filter((tx) => {
      const t = new Date(tx.createdAt).getTime();
      return t >= start && t < end;
    });
    weeks.push({ week: label, achats: txInWeek.length, credits: txInWeek.reduce((s, t) => s + t.price, 0) });
  }
  return weeks;
};

// ─── Cumulative spend (real only) ─────────────────────────────────────────────

export interface CumulativePoint {
  date: string;
  total: number;
}

export const getCumulativeSpend = (transactions: Transaction[]): CumulativePoint[] => {
  const sorted = [...transactions].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let cum = 0;
  return sorted.map((tx) => {
    cum += tx.price;
    return { date: tx.createdAt.slice(5, 10).replace('-', '/'), total: cum };
  });
};

// ─── Trending trees (most purchased from transactions) ────────────────────────

export interface TrendingTree {
  name: string;
  itemId: string;
  lat: number;
  lng: number;
  achats: number;
  totalCredits: number;
}

export const getTrendingTrees = (transactions: Transaction[]): TrendingTree[] => {
  const map: Record<string, { achats: number; totalCredits: number; itemId: string; lat: number; lng: number }> = {};
  for (const tx of transactions) {
    const key = tx.itemId;
    if (!map[key]) map[key] = { achats: 0, totalCredits: 0, itemId: tx.itemId, lat: tx.lat, lng: tx.lng };
    map[key].achats++;
    map[key].totalCredits += tx.price;
  }
  return Object.entries(map)
    .map(([, data]) => ({
      name: transactions.find((t) => t.itemId === data.itemId)?.itemName || 'Inconnu',
      ...data,
    }))
    .sort((a, b) => b.achats - a.achats)
    .slice(0, 8);
};

// ─── Arrondissement mapping from coordinates ──────────────────────────────────
// Approximate geographic centers of Paris's 20 arrondissements

const ARR_CENTERS: Array<{ arr: number; lat: number; lng: number }> = [
  { arr: 1,  lat: 48.8606, lng: 2.3477 },
  { arr: 2,  lat: 48.8666, lng: 2.3490 },
  { arr: 3,  lat: 48.8637, lng: 2.3609 },
  { arr: 4,  lat: 48.8551, lng: 2.3538 },
  { arr: 5,  lat: 48.8462, lng: 2.3508 },
  { arr: 6,  lat: 48.8490, lng: 2.3329 },
  { arr: 7,  lat: 48.8566, lng: 2.3171 },
  { arr: 8,  lat: 48.8740, lng: 2.3080 },
  { arr: 9,  lat: 48.8769, lng: 2.3372 },
  { arr: 10, lat: 48.8776, lng: 2.3624 },
  { arr: 11, lat: 48.8589, lng: 2.3793 },
  { arr: 12, lat: 48.8417, lng: 2.3922 },
  { arr: 13, lat: 48.8310, lng: 2.3567 },
  { arr: 14, lat: 48.8284, lng: 2.3244 },
  { arr: 15, lat: 48.8422, lng: 2.2938 },
  { arr: 16, lat: 48.8637, lng: 2.2680 },
  { arr: 17, lat: 48.8849, lng: 2.3174 },
  { arr: 18, lat: 48.8924, lng: 2.3447 },
  { arr: 19, lat: 48.8822, lng: 2.3869 },
  { arr: 20, lat: 48.8640, lng: 2.4001 },
];

const getArrondissement = (lat: number, lng: number): number => {
  let minDist = Infinity;
  let nearest = 1;
  for (const c of ARR_CENTERS) {
    const d = (lat - c.lat) ** 2 + (lng - c.lng) ** 2;
    if (d < minDist) { minDist = d; nearest = c.arr; }
  }
  return nearest;
};

// ─── Arrondissement stats ─────────────────────────────────────────────────────

export interface ArrondissementStats {
  arr: string;         // "1er", "2e", …
  arrNum: number;
  total: number;       // total trees from Paris API
  sponsored: number;   // from backend
  available: number;
  avgPriceSponsored: number;
  minPriceAvailable: number;
  occupancyPct: number;
}

const arrLabel = (n: number) => (n === 1 ? '1er' : `${n}e`);

export const getArrondissementStats = (allParisTrees: ParisTree[], backendTrees: BackendTree[]): ArrondissementStats[] => {
  const data: Record<number, { prices: number[]; sponsored: number; total: number }> = {};
  for (let i = 1; i <= 20; i++) data[i] = { prices: [], sponsored: 0, total: 0 };

  // 1. Count ALL trees from Paris Open Data
  for (const tree of allParisTrees) {
    let arr = tree.district ? Number(String(tree.district).replace(/\D/g, '')) : null;
    if (!arr || arr < 1 || arr > 20) {
      arr = getArrondissement(tree.lat, tree.lon);
    }
    data[arr].total++;
  }

  // 2. Add sponsored data from Backend
  for (const tree of backendTrees) {
    const [lng, lat] = tree.location.coordinates;
    const arr = getArrondissement(lat, lng);
    if (tree.ownerId) {
      data[arr].sponsored++;
      data[arr].prices.push(tree.price);
    }
  }

  return Object.entries(data)
    .filter(([, d]) => d.total > 0)
    .map(([num, d]) => {
      const n = Number(num);
      const avgP = d.prices.length > 0 ? Math.round(d.prices.reduce((s, p) => s + p, 0) / d.prices.length) : 0;
      return {
        arr: arrLabel(n),
        arrNum: n,
        total: d.total,
        sponsored: d.sponsored,
        available: Math.max(0, d.total - d.sponsored),
        avgPriceSponsored: avgP,
        minPriceAvailable: 0, // Cannot easily know min price of available trees without parsing their sizes
        occupancyPct: Math.round((d.sponsored / d.total) * 100),
      };
    })
    .sort((a, b) => a.arrNum - b.arrNum);
};

// ─── Scatter ──────────────────────────────────────────────────────────────────

export interface ScatterPoint {
  company: string;
  arbres: number;
  valeur: number;
  isCurrent: boolean;
  color: string;
}

const COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  '#ff5722', '#795548', '#9e9e9e', '#607d8b'
];

export const getColorFromName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const getScatterData = (
  leaderboardMT: LeaderboardUser[],
  leaderboardTV: LeaderboardUser[],
  currentUserId: string,
): ScatterPoint[] => {
  const userMap = new Map<string, ScatterPoint>();

  for (const u of leaderboardTV) {
    userMap.set(u.id, {
      company: u.username,
      arbres: u.treeCount ?? 0,
      valeur: u.totalValue ?? 0,
      isCurrent: u.id === currentUserId,
      color: getColorFromName(u.username),
    });
  }

  for (const u of leaderboardMT) {
    if (!userMap.has(u.id)) {
      userMap.set(u.id, {
        company: u.username,
        arbres: u.treeCount ?? 0,
        valeur: u.totalValue ?? 0,
        isCurrent: u.id === currentUserId,
        color: getColorFromName(u.username),
      });
    } else {
      // update tree count just in case it was missing in TV
      const existing = userMap.get(u.id)!;
      existing.arbres = u.treeCount ?? existing.arbres;
    }
  }

  return Array.from(userMap.values());
};
