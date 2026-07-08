import type { SpendingPoint, SponsoredTree } from '../../types/dashboard.types';
import { formatDateFr } from '../../utils/format';

/** Estimation : nombre de crédits investis finançant un arbre réellement planté. */
export const CREDITS_PER_REAL_TREE = 250;

export const getTotalInvested = (trees: SponsoredTree[]): number =>
  trees.reduce((total, tree) => total + tree.pricePaid, 0);

/** Arbres réellement plantés financés par les crédits investis (estimation). */
export const getRealTreesPlanted = (totalInvested: number): number =>
  Math.floor(totalInvested / CREDITS_PER_REAL_TREE);

export const getTop3ExpensiveTrees = (trees: SponsoredTree[]): SponsoredTree[] => {
  if (trees.length === 0) {
    return [];
  }
  const sorted = [...trees].sort((a, b) => b.pricePaid - a.pricePaid);
  return sorted.slice(0, 3);
};

/** Cumul des investissements par jour d'achat, en ordre chronologique. */
export const getSpendingOverTime = (trees: SponsoredTree[]): SpendingPoint[] => {
  const sortedByDate = [...trees].sort((a, b) => a.purchasedAt.localeCompare(b.purchasedAt));

  let cumulativeSpent = 0;
  return sortedByDate.map((tree) => {
    cumulativeSpent += tree.pricePaid;
    return { date: formatDateFr(tree.purchasedAt).slice(0, 5), cumulativeSpent };
  });
};

export const getTreeMapLink = (tree: SponsoredTree): string =>
  `/map?treeId=${encodeURIComponent(tree.id)}&lat=${tree.lat}&lon=${tree.lon}`;
