import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, CircularProgress, Typography, Alert, useTheme, Chip, alpha,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlaceIcon from '@mui/icons-material/Place';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ScatterChart,
  Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts';
import { axiosClient } from '../../api/axiosClient';
import { transactionApi, type Transaction, type TransactionStats } from '../../api/transaction.api';
import { userApi, type LeaderboardUser } from '../../api/user.api';
import { treeApi, type BackendTree } from '../../api/tree.api';
import { fetchAllParisTrees } from '../../api/parisTreesApi';
import type { ParisTree } from '../../types/tree';
import { useAuth } from '../../context/AuthContext';
import { formatCredits } from '../../utils/format';
import {
  getMonthlySpend,
  getBudgetBreakdown,
  getWeeklyVelocity,
  getCumulativeSpend,
  getTrendingTrees,
  getArrondissementStats,
  getScatterData,
  getColorFromName,
} from './stats.selectors';
import { getRealTreesPlanted } from '../DashboardPage/dashboard.selectors';
import { RealImpactCard } from '../../components/organisms/RealImpactCard/RealImpactCard';
import type { SponsoredTree } from '../../types/dashboard.types';

// ─── ChartCard ────────────────────────────────────────────────────────────────

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, badge, children, height }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: theme.shadows[3],
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {title}
        </Typography>
        {badge && <Chip label={badge} size="small" color="primary" variant="outlined" sx={{ fontSize: 11 }} />}
      </Box>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: 2, height: height ?? 240 }}>{children}</Box>
    </Box>
  );
};

// ─── Tooltips ─────────────────────────────────────────────────────────────────

const TooltipCredits = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, minWidth: 150 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.map((p: any) => (
        <Typography key={p.dataKey} variant="caption" sx={{ display: 'block', color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value > 20 ? formatCredits(p.value) : p.value}
        </Typography>
      ))}
    </Box>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const StatsPage: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myTrees, setMyTrees] = useState<SponsoredTree[]>([]);
  const [allTrees, setAllTrees] = useState<BackendTree[]>([]);
  const [allParisTrees, setAllParisTrees] = useState<ParisTree[]>([]);
  const [leaderboardTV, setLeaderboardTV] = useState<LeaderboardUser[]>([]);
  const [leaderboardMT, setLeaderboardMT] = useState<LeaderboardUser[]>([]);
  const [globalStats, setGlobalStats] = useState<TransactionStats | null>(null);

  const GREEN = '#2e7d32';
  const GREEN_LIGHT = '#66bb6a';
  const GREEN_MID = '#43a047';
  const AMBER = '#ffc107';
  const BLUE = '#1976d2';
  const TEAL = '#00897b';
  const grid = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textColor = theme.palette.text.secondary;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [txRes, treeRes, tvRes, mtRes, parisTrees, globalStatsRes] = await Promise.all([
        axiosClient.request<Transaction[]>(transactionApi.getMyTransactions()),
        axiosClient.request<BackendTree[]>(treeApi.getAll()),
        axiosClient.request<LeaderboardUser[]>(userApi.getLeaderboardTotalValue(1000)),
        axiosClient.request<LeaderboardUser[]>(userApi.getLeaderboardMostTrees(1000)),
        fetchAllParisTrees(),
        axiosClient.request<TransactionStats>(transactionApi.getTotalStats()),
      ]);
      setTransactions(txRes.data);
      setAllTrees(treeRes.data);
      setAllParisTrees(parisTrees);
      setGlobalStats(globalStatsRes.data);
      setMyTrees(
        treeRes.data
          .filter((t) => t.ownerId === user?.id)
          .map((t) => ({
            id: t.id,
            species: t.name,
            arrondissement: 1,
            pricePaid: t.price,
            purchasedAt: new Date().toISOString(),
            lat: t.location.coordinates[1],
            lon: t.location.coordinates[0],
          })),
      );
      setLeaderboardTV(tvRes.data);
      setLeaderboardMT(mtRes.data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography>Analyse en cours…</Typography>
      </Box>
    );
  }
  if (error) {
    return <Container maxWidth="lg" sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  }

  // ── Derived ──────────────────────────────────────────────────────────────────
  const totalInvested = myTrees.reduce((s, t) => s + t.pricePaid, 0);
  const creditsRemaining = user?.credits ?? 0;
  const avgPrice = myTrees.length > 0 ? Math.round(totalInvested / myTrees.length) : 0;
  const totalSponsoredGlobal = allTrees.filter((t) => t.ownerId).length;
  const totalAvailableGlobal = allParisTrees.length - totalSponsoredGlobal;

  const buyTransactions = transactions.filter(t => t.action === 'BUY');
  const monthlySpend    = getMonthlySpend(buyTransactions);
  const budgetBreakdown = getBudgetBreakdown(totalInvested, creditsRemaining);
  const weeklyVelocity  = getWeeklyVelocity(buyTransactions);
  const cumulativeSpend = getCumulativeSpend(buyTransactions);
  const trendingTrees   = getTrendingTrees(buyTransactions);
  const arrStats        = getArrondissementStats(allParisTrees, allTrees);
  const scatterData     = getScatterData(leaderboardMT, leaderboardTV, user?.id ?? '');

  const topTV = [...leaderboardTV]
    .sort((a, b) => (b.totalValue ?? 0) - (a.totalValue ?? 0))
    .slice(0, 10)
    .map((u) => ({ name: u.username, valeur: u.totalValue ?? 0, isCurrent: u.id === user?.id }));

  const topMT = [...leaderboardMT]
    .sort((a, b) => (b.treeCount ?? 0) - (a.treeCount ?? 0))
    .slice(0, 10)
    .map((u) => ({ name: u.username, arbres: u.treeCount ?? 0, isCurrent: u.id === user?.id }));

  const marketBreakdown = [
    { name: 'Parrainés', value: totalSponsoredGlobal, color: GREEN },
    { name: 'Disponibles', value: totalAvailableGlobal, color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' },
  ];

  // Navigate to map and zoom on a tree
  const goToTree = (itemId: string) => {
    navigate(`/map?treeId=${encodeURIComponent(itemId)}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <BarChartIcon sx={{ color: 'primary.main', fontSize: 38 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>Statistiques</Typography>
          <Typography variant="body2" color="text.secondary">Vue analytique complète — InvesTree</Typography>
        </Box>
      </Box>

      {/* KPI strip */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {[
          { label: 'Mes crédits dépensés', value: formatCredits(totalInvested), color: GREEN },
          { label: 'Mes crédits restants', value: formatCredits(creditsRemaining), color: GREEN_LIGHT },
          { label: 'Mes arbres', value: String(myTrees.length), color: AMBER },
          { label: 'Mon prix moyen', value: formatCredits(avgPrice), color: BLUE },
        ].map(({ label, value, color }) => (
          <Box key={label} sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'divider', borderLeft: `4px solid ${color}` }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color }}>{value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Global Market KPIs */}
      <Box sx={{ 
        bgcolor: alpha(theme.palette.primary.main, 0.04), 
        border: '1px solid', borderColor: 'primary.main', 
        borderRadius: 3, p: 3, mt: 1,
        display: 'flex', flexDirection: 'column', gap: 3
      }}>
        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon />
          Marché Global InvesTree
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {[
            { label: 'Total Investi (Global)', value: formatCredits(globalStats?.totalCredits ?? 0), color: GREEN_MID },
            { label: 'Arbres Parrainés (Global)', value: String(globalStats?.totalTrees ?? 0), color: AMBER },
            { label: 'Arbres Disponibles (Global)', value: String(totalAvailableGlobal), color: TEAL },
          ].map(({ label, value, color }) => (
            <Box key={label} sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'divider', borderLeft: `4px solid ${color}` }}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color }}>{value}</Typography>
            </Box>
          ))}
        </Box>

        <RealImpactCard
          realTreesPlanted={getRealTreesPlanted(globalStats?.totalCredits ?? 0)}
          title="Impact environnemental global"
          subtitle="Arbres réellement plantés grâce aux investissements de toutes les entreprises confondues."
        />
      </Box>

      {/* Row 1: Monthly + Donut */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 3 }}>
        <ChartCard title="Dépenses mensuelles" subtitle="Crédits dépensés par mois">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySpend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} />
              <Tooltip content={<TooltipCredits />} />
              <Bar dataKey="spend" name="Crédits dépensés" fill={GREEN} radius={[4, 4, 0, 0]} maxBarSize={64} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Répartition du budget">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetBreakdown}
                cx="50%"
                cy="42%"
                innerRadius={58}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {budgetBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCredits(Number(v))} />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={(value, entry: any) => (
                  <span style={{ color: textColor, fontSize: 13 }}>
                    {value} — <strong>{formatCredits(entry.payload.value)}</strong>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      {/* Row 2: Cumulative + Velocity */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <ChartCard title="Dépenses cumulées" subtitle="Crédits dépensés au total dans le temps (achats réels)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeSpend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GREEN} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(v) => formatCredits(v)} />
              <Tooltip content={<TooltipCredits />} />
              <Area type="monotone" dataKey="total" name="Total dépensé" stroke={GREEN} fill="url(#gradCum)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vélocité hebdomadaire" subtitle="Achats et crédits dépensés par semaine (8 semaines)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyVelocity} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="week" tick={{ fill: textColor, fontSize: 11 }} />
              <YAxis yAxisId="left" allowDecimals={false} tick={{ fill: textColor, fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: textColor, fontSize: 11 }} />
              <Tooltip content={<TooltipCredits />} />
              <Legend />
              <Bar yAxisId="left" dataKey="achats" name="Achats" fill={BLUE} radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar yAxisId="right" dataKey="credits" name="Crédits" fill={GREEN} radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      {/* Trending trees — clickable */}
      <ChartCard
        title="Arbres les plus achetés"
        subtitle="Cliquez sur une barre pour voir l'arbre sur la carte"
        badge="Tendances"
        height={280}
      >
        {trendingTrees.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="text.secondary">Pas encore de transactions</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={trendingTrees}
              margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
              onClick={(data: any) => {
                if (data?.activePayload?.[0]) {
                  const item = data.activePayload[0].payload as { itemId: string };
                  goToTree(item.itemId);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: textColor, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fill: textColor, fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as { achats: number; totalCredits: number };
                  return (
                    <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{label}</Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>Achats : {d.achats}</Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>Total dépensé : {formatCredits(d.totalCredits)}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: GREEN_LIGHT, mt: 0.5 }}>Cliquer pour voir sur la carte</Typography>
                    </Box>
                  );
                }}
              />
              <Bar dataKey="achats" name="Achats" fill={AMBER} radius={[0, 4, 4, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Arrondissement section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <PlaceIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Analyse par arrondissement</Typography>
      </Box>

      {/* Arr row 1: Occupation % + avg price sponsored */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <ChartCard title="Taux d'occupation par arrondissement" subtitle="% d'arbres déjà parrainés sur le total de chaque arrondissement" height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={arrStats} margin={{ top: 4, right: 8, left: 0, bottom: 32 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="arr" tick={{ fill: textColor, fontSize: 10 }} angle={-45} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v) => `${v}%`}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as { sponsored: number; total: number; occupancyPct: number };
                  return (
                    <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Arr. {label}</Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>Parrainés : {d.sponsored} / {d.total}</Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>Taux : {d.occupancyPct}%</Typography>
                    </Box>
                  );
                }}
              />
              <Bar dataKey="occupancyPct" name="Occupation (%)" radius={[3, 3, 0, 0]}>
                {arrStats.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.occupancyPct > 50 ? GREEN : entry.occupancyPct > 20 ? GREEN_MID : GREEN_LIGHT}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Prix moyen des arbres parrainés" subtitle="Valeur moyenne des arbres acquis dans chaque arrondissement" height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={arrStats.filter((a) => a.avgPriceSponsored > 0)} margin={{ top: 4, right: 8, left: 0, bottom: 32 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="arr" tick={{ fill: textColor, fontSize: 10 }} angle={-45} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(v) => formatCredits(v)} />
              <Tooltip content={<TooltipCredits />} />
              <Bar dataKey="avgPriceSponsored" name="Prix moyen (cr.)" fill={BLUE} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      {/* Arr row 2: available trees */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 3 }}>
        <ChartCard title="Arbres disponibles par arrondissement" subtitle="Nombre d'arbres encore libres de parrainage (sur toute la ville)" height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={arrStats} margin={{ top: 4, right: 8, left: 0, bottom: 32 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="arr" tick={{ fill: textColor, fontSize: 10 }} angle={-45} textAnchor="end" interval={0} />
              <YAxis allowDecimals={false} tick={{ fill: textColor, fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="available" name="Arbres disponibles" fill={TEAL} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      {/* Leaderboard section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <TrendingUpIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Compétition</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
        <ChartCard title="Top 10 — Valeur totale" subtitle="Vous en vert" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topTV} margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis type="number" tick={{ fill: textColor, fontSize: 10 }} tickFormatter={(v) => formatCredits(v)} />
              <YAxis type="category" dataKey="name" width={70} tick={{ fill: textColor, fontSize: 10 }} />
              <Tooltip formatter={(v) => formatCredits(Number(v))} />
              <Bar dataKey="valeur" name="Valeur" radius={[0, 4, 4, 0]}>
                {topTV.map((e, i) => <Cell key={i} fill={e.isCurrent ? GREEN : getColorFromName(e.name)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 — Nombre d'arbres" subtitle="Vous en vert" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topMT} margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: textColor, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={70} tick={{ fill: textColor, fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="arbres" name="Arbres" radius={[0, 4, 4, 0]}>
                {topMT.map((e, i) => <Cell key={i} fill={e.isCurrent ? GREEN : getColorFromName(e.name)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Etat du marché global" subtitle="Arbres parrainés vs. disponibles dans toute la ville" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={marketBreakdown}
                cx="50%"
                cy="40%"
                innerRadius={58}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {marketBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={(value, entry: any) => (
                  <span style={{ color: textColor, fontSize: 12 }}>
                    {value} — <strong>{entry.payload.value}</strong>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      {/* Scatter */}
      <ChartCard title="Valeur totale vs. Nombre d'arbres" subtitle="Chaque point = une entreprise. Vous etes en vert." height={260}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis type="number" dataKey="arbres" name="Arbres" tick={{ fill: textColor, fontSize: 12 }} label={{ value: "Nombre d'arbres", position: 'insideBottom', offset: -12, fill: textColor, fontSize: 11 }} />
            <YAxis type="number" dataKey="valeur" name="Valeur" tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(v) => formatCredits(v)} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { company: string; arbres: number; valeur: number };
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{d.company}</Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>Arbres : {d.arbres}</Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>Valeur : {formatCredits(d.valeur)}</Typography>
                  </Box>
                );
              }}
            />
            <Scatter data={scatterData.filter((d) => !d.isCurrent)} fill={isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'} r={5} />
            <Scatter data={scatterData.filter((d) => d.isCurrent)} fill={GREEN} r={9} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

    </Container>
  );
};
