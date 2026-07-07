import React from 'react';
import { Box, Container } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import ParkIcon from '@mui/icons-material/Park';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { KpiCard } from '../../components/molecules/KpiCard/KpiCard';
import type { KpiCardProps } from '../../components/molecules/KpiCard/KpiCard';
import { DashboardHeader } from '../../components/organisms/DashboardHeader/DashboardHeader';
import { InvestmentChart } from '../../components/organisms/InvestmentChart/InvestmentChart';
import { LeaderboardCard } from '../../components/organisms/LeaderboardCard/LeaderboardCard';
import { PremiumTreeCard } from '../../components/organisms/PremiumTreeCard/PremiumTreeCard';
import { RankProgressCard } from '../../components/organisms/RankProgressCard/RankProgressCard';
import { RealImpactCard } from '../../components/organisms/RealImpactCard/RealImpactCard';
import { SponsoredTreesTable } from '../../components/organisms/SponsoredTreesTable/SponsoredTreesTable';
import { TransactionsHistory } from '../../components/organisms/TransactionsHistory/TransactionsHistory';
import { DASHBOARD_MOCK } from '../../mocks/dashboard.mocks';
import { formatCredits, formatNumberFr, formatOrdinalFr } from '../../utils/format';
import {
  getMostExpensiveTree,
  getNextRankEntry,
  getRealTreesPlanted,
  getSpendingOverTime,
  getTotalInvested,
  getTransactionHistory,
  getTreeMapLink,
} from './dashboard.selectors';

// Le backend n'expose pas encore d'endpoint dashboard : les données viennent des
// fixtures locales, à remplacer par la future couche API (src/api).
const dashboard = DASHBOARD_MOCK;

export const DashboardPage: React.FC = () => {
  const { companyName, creditsRemaining, rank, totalCompanies, leaderboard, sponsoredTrees } = dashboard;

  const totalInvested = getTotalInvested(sponsoredTrees);
  const realTreesPlanted = getRealTreesPlanted(totalInvested);
  const mostExpensiveTree = getMostExpensiveTree(sponsoredTrees);
  const nextRankEntry = getNextRankEntry(leaderboard, rank);
  const spendingOverTime = getSpendingOverTime(sponsoredTrees);
  const transactions = getTransactionHistory(sponsoredTrees);

  const currentLeaderboardEntry = leaderboard.find((entry) => entry.companyName === companyName) ?? {
    rank,
    companyName,
    totalInvested,
    sponsoredTreesCount: sponsoredTrees.length,
  };

  const kpis: KpiCardProps[] = [
    {
      label: 'Montant investi',
      value: formatCredits(totalInvested),
      description: "Total dépensé dans le sponsoring d'arbres",
      icon: <PaidIcon color="primary" />,
    },
    {
      label: 'Arbres sponsorisés',
      value: formatNumberFr(sponsoredTrees.length),
      description: 'Arbres actuellement détenus par votre entreprise',
      icon: <ParkIcon color="primary" />,
    },
    {
      label: 'Crédits restants',
      value: formatCredits(creditsRemaining),
      description: 'Budget encore disponible',
      icon: <AccountBalanceWalletIcon color="primary" />,
    },
    {
      label: 'Rang actuel',
      value: `${formatOrdinalFr(rank)} / ${totalCompanies}`,
      description: 'Position dans le leaderboard des entreprises',
      icon: <MilitaryTechIcon color="primary" />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <DashboardHeader companyName={companyName} mapPath="/" />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </Box>

      <RealImpactCard realTreesPlanted={realTreesPlanted} />

      {nextRankEntry ? <RankProgressCard currentInvested={totalInvested} nextRankEntry={nextRankEntry} /> : null}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 3 }}>
        {mostExpensiveTree ? (
          <PremiumTreeCard tree={mostExpensiveTree} mapLink={getTreeMapLink(mostExpensiveTree)} />
        ) : null}
        <LeaderboardCard topEntries={leaderboard} currentEntry={currentLeaderboardEntry} />
      </Box>

      <SponsoredTreesTable trees={sponsoredTrees} getMapLink={getTreeMapLink} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 3 }}>
        <InvestmentChart points={spendingOverTime} />
        <TransactionsHistory transactions={transactions} />
      </Box>
    </Container>
  );
};
