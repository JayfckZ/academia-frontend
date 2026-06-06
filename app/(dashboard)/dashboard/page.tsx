'use client'

import { Grid, Paper, Typography, Box } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Alunos Ativos',
      value: '1.284',
      icon: <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 184.500',
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#00e676' }} />
    },
    {
      title: 'Planos Vendidos',
      value: '342',
      icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#ff9100' }} />
    }
  ]

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Visão Geral
      </Typography>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                bgcolor: 'background.paper',
                borderRadius: 3
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 1 }}
                >
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: 2
                }}
              >
                {stat.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
