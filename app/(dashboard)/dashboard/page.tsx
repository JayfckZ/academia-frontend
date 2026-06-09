'use client'

import { useState, useEffect, ReactNode } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider
} from '@mui/material'

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import GroupIcon from '@mui/icons-material/Group'
import UpdateIcon from '@mui/icons-material/Update'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'

import { apiFetch } from '@/app/lib/api'

interface StatCardItem {
  title: string
  value: string | number
  subtitle: string
  icon: ReactNode
  iconBg: string
}
interface DashboardStats {
  activeStudents: number
  realizedRevenue: number
  expectedRevenue: number
  overdueAmount: number
  overdueCount: number
  expiringEnrollments: number
  canceledEnrollments: number
  ticketMedio: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch('/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao carregar stats', err)
        setLoading(false)
      })
  }, [])

  if (loading || !stats) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh'
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const financeCards = [
    {
      title: 'Receita Prevista (Mês)',
      value: formatCurrency(stats.expectedRevenue),
      subtitle: 'Total esperado para o mês',
      icon: (
        <AccountBalanceWalletIcon sx={{ fontSize: 32, color: 'info.main' }} />
      ),
      iconBg: 'rgba(2, 136, 209, 0.1)'
    },
    {
      title: 'Receita Realizada (Mês)',
      value: formatCurrency(stats.realizedRevenue),
      subtitle: `Ticket Médio: ${formatCurrency(stats.ticketMedio)}`,
      icon: <AttachMoneyIcon sx={{ fontSize: 32, color: 'success.main' }} />,
      iconBg: 'rgba(46, 125, 50, 0.1)'
    },
    {
      title: 'Inadimplência (Atrasados)',
      value: formatCurrency(stats.overdueAmount),
      subtitle: `${stats.overdueCount} boleto(s) em atraso`,
      icon: <MoneyOffIcon sx={{ fontSize: 32, color: 'error.main' }} />,
      iconBg: 'rgba(211, 47, 47, 0.1)'
    }
  ]

  const operationalCards = [
    {
      title: 'Alunos Ativos',
      value: stats.activeStudents,
      subtitle: 'Total de clientes na base',
      icon: <GroupIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      iconBg: 'rgba(25, 118, 210, 0.1)'
    },
    {
      title: 'Renovações (Próx 30 dias)',
      value: stats.expiringEnrollments,
      subtitle: 'Matrículas perto do vencimento',
      icon: <UpdateIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
      iconBg: 'rgba(237, 108, 2, 0.1)'
    },
    {
      title: 'Cancelamentos (Mês)',
      value: stats.canceledEnrollments,
      subtitle: 'Alunos que deixaram a academia',
      icon: <PersonRemoveIcon sx={{ fontSize: 32, color: 'error.main' }} />,
      iconBg: 'rgba(211, 47, 47, 0.1)'
    }
  ]

  const StatCard = ({ item }: { item: StatCardItem }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        bgcolor: 'background.paper',
        borderRadius: 3,
        height: '100%'
      }}
    >
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 1 }}
        >
          {item.title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'var(--font-fira-code)',
            mb: 0.5
          }}
        >
          {item.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {item.subtitle}
        </Typography>
      </Box>
      <Box
        sx={{ p: 1.5, bgcolor: item.iconBg, borderRadius: 2, display: 'flex' }}
      >
        {item.icon}
      </Box>
    </Paper>
  )

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Visão Geral da Academia
      </Typography>

      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}
      >
        Financeiro
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {financeCards.map((card, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <StatCard item={card} />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 5, borderColor: 'rgba(255,255,255,0.05)' }} />

      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}
      >
        Operacional
      </Typography>
      <Grid container spacing={3}>
        {operationalCards.map((card, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <StatCard item={card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
