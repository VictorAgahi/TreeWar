import React, { useEffect, useState } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import ParkIcon from '@mui/icons-material/Park';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { KpiCard } from '../../components/molecules/KpiCard/KpiCard';
import type { KpiCardProps } from '../../components/molecules/KpiCard/KpiCard';
import { DashboardHeader } from '../../components/organisms/DashboardHeader/DashboardHeader';
import { InvestmentChart } from '../../components/organisms/InvestmentChart/InvestmentChart';
import { LeaderboardCard } from '../../components/organisms/LeaderboardCard/LeaderboardCard';
import { PremiumTreeCard } from '../../components/organisms/PremiumTreeCard/PremiumTreeCard';
import { RankProgressCard } from '../../components/organisms/RankProgressCard/RankProgressCard';
import { RealImpactCard } from '../../components/organisms/RealImpactCard/RealImpactCard';
import { TransactionsHistory } from '../../components/organisms/TransactionsHistory/TransactionsHistory';
import { formatCredits, formatNumberFr } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { axiosClient } from '../../api/axiosClient';
import { userApi, type LeaderboardUser } from '../../api/user.api';
import { treeApi, type BackendTree as Tree } from '../../api/tree.api';
import { transactionApi, type Transaction } from '../../api/transaction.api';

import {
  getMostExpensiveTree,
  getRealTreesPlanted,
  getSpendingOverTime,
  getTotalInvested,
  getTreeMapLink,
} from './dashboard.selectors';

type LeaderboardEntry = {
  rank: number;
  companyName: string;
  totalInvested: number;
  sponsoredTreesCount: number;
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leaderboardTotalValue, setLeaderboardTotalValue] = useState<LeaderboardUser[]>([]);
  const [leaderboardMostTrees, setLeaderboardMostTrees] = useState<LeaderboardUser[]>([]);
  const [leaderboardExpensiveTree, setLeaderboardExpensiveTree] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [treesRes, transactionsRes, totalValueRes, mostTreesRes, expensiveTreeRes] = await Promise.all([
          axiosClient.request<Tree[]>(treeApi.getAll()),
          axiosClient.request<Transaction[]>(transactionApi.getMyTransactions()),
          axiosClient.request<LeaderboardUser[]>(userApi.getLeaderboardTotalValue()),
          axiosClient.request<LeaderboardUser[]>(userApi.getLeaderboardMostTrees()),
          axiosClient.request<LeaderboardUser[]>(userApi.getLeaderboardMostExpensiveTree()),
        ]);

        console.log('--- DASHBOARD DATA FETCHED ---');
        console.log('Trees:', treesRes.data);
        console.log('Transactions:', transactionsRes.data);
        console.log('Leaderboard (Total Value):', totalValueRes.data);
        console.log('Leaderboard (Most Trees):', mostTreesRes.data);
        console.log('Leaderboard (Expensive Tree):', expensiveTreeRes.data);

        setTrees(treesRes.data.filter(t => t.ownerId === user?.id));
        setTransactions(transactionsRes.data);
        setLeaderboardTotalValue(totalValueRes.data);
        setLeaderboardMostTrees(mostTreesRes.data);
        setLeaderboardExpensiveTree(expensiveTreeRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const companyName = user.username;
  const creditsRemaining = user.credits;
  
  // Build frontend expected structures from backend data
  const sponsoredTrees = trees.map(t => ({
    id: t.id,
    species: t.name,
    arrondissement: 1,
    pricePaid: t.price,
    purchasedAt: new Date().toISOString(),
    lat: t.location.coordinates[1],
    lon: t.location.coordinates[0],
  }));

  const mappedTransactions = transactions.map(t => ({
    id: t.id,
    species: t.itemName,
    arrondissement: 1, // Fallback
    pricePaid: t.price,
    purchasedAt: t.createdAt,
    lat: t.lat,
    lon: t.lng,
  }));

  const totalInvested = getTotalInvested(sponsoredTrees);
  const realTreesPlanted = getRealTreesPlanted(totalInvested);
  const mostExpensiveTree = getMostExpensiveTree(sponsoredTrees);
  const spendingOverTime = getSpendingOverTime(mappedTransactions); // Pass transactions to get true spending over time

  const parseLeaderboard = (users: LeaderboardUser[]): LeaderboardEntry[] => 
    users.map((u, index) => ({
      rank: index + 1,
      companyName: u.username,
      totalInvested: u.totalValue || 0,
      sponsoredTreesCount: u.treeCount || 0,
      maxTreePrice: u.maxTreePrice || 0,
    }));

  const leaderboardTV = parseLeaderboard(leaderboardTotalValue);
  const leaderboardMT = parseLeaderboard(leaderboardMostTrees);
  const leaderboardET = parseLeaderboard(leaderboardExpensiveTree);

  // We keep rank based on total value for the KPI
  const currentUserIndex = leaderboardTotalValue.findIndex((u) => u.id === user.id);
  const rank = currentUserIndex !== -1 ? currentUserIndex + 1 : 0;
  const nextRankEntry = rank > 1 ? leaderboardTV[rank - 2] : undefined;

  const currentLeaderboardEntry = currentUserIndex !== -1 
    ? leaderboardTV[currentUserIndex] 
    : {
        rank: 0,
        companyName,
        totalInvested,
        sponsoredTreesCount: sponsoredTrees.length,
        maxTreePrice: mostExpensiveTree?.pricePaid || 0,
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
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <DashboardHeader companyName={companyName} mapPath="/" />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </Box>

      <RealImpactCard realTreesPlanted={realTreesPlanted} />

      {nextRankEntry && rank > 0 ? <RankProgressCard currentInvested={totalInvested} nextRankEntry={nextRankEntry} /> : null}

      {mostExpensiveTree ? (
        <Box sx={{ width: { xs: '100%', md: '50%' }, alignSelf: 'center' }}>
          <PremiumTreeCard tree={mostExpensiveTree} mapLink={getTreeMapLink(mostExpensiveTree)} />
        </Box>
      ) : null}

      <LeaderboardCard 
        topEntriesTV={leaderboardTV} 
        topEntriesMT={leaderboardMT} 
        topEntriesET={leaderboardET} 
        currentEntry={currentLeaderboardEntry} 
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 3 }}>
        <InvestmentChart points={spendingOverTime} />
        <TransactionsHistory transactions={mappedTransactions} />
      </Box>
    </Container>
  );
};
