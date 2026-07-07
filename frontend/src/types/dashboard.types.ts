export interface SponsoredTree {
  id: string;
  species: string;
  /** Numéro d'arrondissement parisien (1 à 20). */
  arrondissement: number;
  /** Prix payé en crédits. */
  pricePaid: number;
  /** Date d'achat au format ISO `YYYY-MM-DD`. */
  purchasedAt: string;
  lat: number;
  lon: number;
}

export interface LeaderboardEntry {
  rank: number;
  companyName: string;
  /** Montant investi en crédits. */
  totalInvested: number;
  sponsoredTreesCount: number;
  maxTreePrice?: number;
}

export interface CompanyDashboardData {
  companyName: string;
  /** Crédits restants (budget encore disponible). */
  creditsRemaining: number;
  /** Rang actuel de l'entreprise dans le classement. */
  rank: number;
  totalCompanies: number;
  /** Top du classement des entreprises (5 premières). */
  leaderboard: LeaderboardEntry[];
  /** Arbres actuellement détenus par l'entreprise. */
  sponsoredTrees: SponsoredTree[];
}

export interface SpendingPoint {
  /** Libellé du point sur l'axe des dates (`JJ/MM`). */
  date: string;
  cumulativeSpent: number;
}
