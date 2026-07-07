import React from 'react';
import { Box, Stack, useTheme } from '@mui/material';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import type { SpendingPoint } from '../../../types/dashboard.types';
import { formatCredits, formatNumberFr } from '../../../utils/format';

const ChartTooltip = ({ active, payload, label }: TooltipContentProps): React.ReactNode => {
  const value = payload?.[0]?.value;
  if (!active || typeof value !== 'number') {
    return null;
  }
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: 2,
        px: 1.5,
        py: 1,
      }}
    >
      <Typography variant="caption" color="text.secondary" component="p">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {formatCredits(value)}
      </Typography>
    </Box>
  );
};

export interface InvestmentChartProps {
  /** Cumul des investissements en ordre chronologique. */
  points: SpendingPoint[];
}

export const InvestmentChart: React.FC<InvestmentChartProps> = ({ points }) => {
  const theme = useTheme();

  if (points.length === 0) {
    return null;
  }

  const totalSpent = points[points.length - 1].cumulativeSpent;

  return (
    <Card component="section" sx={{ height: '100%' }}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2" sx={{ color: 'primary.dark', fontWeight: 700 }}>
          Évolution de vos investissements
        </Typography>
        <Box
          role="img"
          aria-label={`Évolution de vos investissements : ${formatCredits(totalSpent)} investis au total. Le détail figure dans les dernières transactions.`}
          sx={{ width: '100%', height: 260 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={theme.palette.divider} strokeWidth={1} vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              />
              <YAxis
                width={52}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                tickFormatter={formatNumberFr}
              />
              <Tooltip content={ChartTooltip} cursor={{ stroke: theme.palette.text.secondary, strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="cumulativeSpent"
                name="Montant investi"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                fill={theme.palette.primary.main}
                fillOpacity={0.1}
                activeDot={{ r: 4, strokeWidth: 2, stroke: theme.palette.background.paper }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Card>
  );
};
