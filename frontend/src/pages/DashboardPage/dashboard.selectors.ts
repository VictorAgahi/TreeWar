import type { LeaderboardEntry, SpendingPoint, SponsoredTree } from '../../types/dashboard.types';
import { formatDateFr } from '../../utils/format';

/** Estimation : nombre de crédits investis finançant un arbre réellement planté. */
export const CREDITS_PER_REAL_TREE = 3;

export const getTotalInvested = (trees: SponsoredTree[]): number =>
  trees.reduce((total, tree) => total + tree.pricePaid, 0);

/** Arbres réellement plantés financés par les crédits investis (estimation). */
export const getRealTreesPlanted = (totalInvested: number): number =>
  Math.floor(totalInvested / CREDITS_PER_REAL_TREE);

export const getMostExpensiveTree = (trees: SponsoredTree[]): SponsoredTree | undefined => {
  if (trees.length === 0) {
    return undefined;
  }
  return trees.reduce((mostExpensive, tree) => (tree.pricePaid > mostExpensive.pricePaid ? tree : mostExpensive));
};

/** Achats triés du plus récent au plus ancien (prix décroissant à date égale). */
export const getTransactionHistory = (trees: SponsoredTree[]): SponsoredTree[] =>
  [...trees].sort(
    (a, b) => b.purchasedAt.localeCompare(a.purchasedAt) || b.pricePaid - a.pricePaid,
  );

/** Cumul des investissements par jour d'achat, en ordre chronologique. */
export const getSpendingOverTime = (trees: SponsoredTree[]): SpendingPoint[] => {
  const spentByDate = new Map<string, number>();
  const sortedByDate = [...trees].sort((a, b) => a.purchasedAt.localeCompare(b.purchasedAt));

  for (const tree of sortedByDate) {
    spentByDate.set(tree.purchasedAt, (spentByDate.get(tree.purchasedAt) ?? 0) + tree.pricePaid);
  }

  let cumulativeSpent = 0;
  return Array.from(spentByDate.entries()).map(([isoDate, spent]) => {
    cumulativeSpent += spent;
    return { date: formatDateFr(isoDate).slice(0, 5), cumulativeSpent };
  });
};

/** Entreprise juste au-dessus dans le classement, si elle est connue. */
export const getNextRankEntry = (
  leaderboard: LeaderboardEntry[],
  currentRank: number,
): LeaderboardEntry | undefined => leaderboard.find((entry) => entry.rank === currentRank - 1);

/**
 * Lien vers la page carte (route `/`), centrée sur l'arbre.
 * Les paramètres sont conservés dans l'URL pour la future carte interactive.
 */
export const getTreeMapLink = (tree: SponsoredTree): string =>
  `/?treeId=${encodeURIComponent(tree.id)}&lat=${tree.lat}&lon=${tree.lon}`;
