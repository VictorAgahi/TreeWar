import type { CompanyDashboardData } from '../types/dashboard.types';

// Fixtures locales en attendant l'endpoint dashboard du backend : conserver la
// forme de `CompanyDashboardData` pour que la future couche API (src/api) puisse
// remplacer cet import sans toucher aux composants.
export const DASHBOARD_MOCK: CompanyDashboardData = {
  companyName: 'GreenCorp',
  creditsRemaining: 4200,
  rank: 3,
  totalCompanies: 24,
  leaderboard: [
    { rank: 1, companyName: 'EcoPulse', totalInvested: 8900, sponsoredTreesCount: 18 },
    { rank: 2, companyName: 'BlueFactory', totalInvested: 7200, sponsoredTreesCount: 15 },
    { rank: 3, companyName: 'GreenCorp', totalInvested: 5800, sponsoredTreesCount: 12 },
    { rank: 4, companyName: 'UrbanLeaf', totalInvested: 4950, sponsoredTreesCount: 10 },
    { rank: 5, companyName: 'NovaCare', totalInvested: 3700, sponsoredTreesCount: 8 },
  ],
  sponsoredTrees: [
    { id: 'tree-001', species: 'Platane commun', arrondissement: 15, pricePaid: 820, purchasedAt: '2026-07-07', lat: 48.8412, lon: 2.2932 },
    { id: 'tree-002', species: 'Érable sycomore', arrondissement: 14, pricePaid: 640, purchasedAt: '2026-07-07', lat: 48.8331, lon: 2.3264 },
    { id: 'tree-003', species: 'Tilleul argenté', arrondissement: 11, pricePaid: 590, purchasedAt: '2026-07-06', lat: 48.8579, lon: 2.3802 },
    { id: 'tree-004', species: "Marronnier d'Inde", arrondissement: 7, pricePaid: 560, purchasedAt: '2026-07-06', lat: 48.856, lon: 2.3125 },
    { id: 'tree-005', species: 'Chêne pédonculé', arrondissement: 12, pricePaid: 540, purchasedAt: '2026-07-06', lat: 48.8399, lon: 2.3868 },
    { id: 'tree-006', species: 'Sophora du Japon', arrondissement: 4, pricePaid: 510, purchasedAt: '2026-07-05', lat: 48.8543, lon: 2.3574 },
    { id: 'tree-007', species: 'Frêne commun', arrondissement: 19, pricePaid: 480, purchasedAt: '2026-07-05', lat: 48.8823, lon: 2.3822 },
    { id: 'tree-008', species: 'Platane commun', arrondissement: 13, pricePaid: 450, purchasedAt: '2026-07-05', lat: 48.8296, lon: 2.3557 },
    { id: 'tree-009', species: 'Tilleul à grandes feuilles', arrondissement: 20, pricePaid: 420, purchasedAt: '2026-07-04', lat: 48.8631, lon: 2.3969 },
    { id: 'tree-010', species: 'Micocoulier de Provence', arrondissement: 5, pricePaid: 320, purchasedAt: '2026-07-04', lat: 48.8443, lon: 2.3499 },
    { id: 'tree-011', species: 'Érable plane', arrondissement: 18, pricePaid: 260, purchasedAt: '2026-07-04', lat: 48.8925, lon: 2.3444 },
    { id: 'tree-012', species: 'Cerisier à fleurs', arrondissement: 10, pricePaid: 210, purchasedAt: '2026-07-03', lat: 48.876, lon: 2.3594 },
  ],
};
