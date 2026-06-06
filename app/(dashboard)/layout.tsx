'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import Image from 'next/image'
import { codefitTheme } from '@/app/lib/theme'

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import PeopleIcon from '@mui/icons-material/People'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import BadgeIcon from '@mui/icons-material/Badge'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import PaymentsIcon from '@mui/icons-material/Payments'

const drawerWidth = 240

interface UserPayload {
  name: string
  role: string
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<UserPayload | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const decodeUserToken = async () => {
    const token = document.cookie.split('codefit_token=')[1]?.split(';')[0]
    if (!token) return null

    const payloadBase64 = token.split('.')[1]

    const decodedJson = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(decodedJson)
  }

  useEffect(() => {
    decodeUserToken()
      .then((payload) => {
        if (payload) {
          setUser({
            name: payload.name || 'Usuário',
            role: payload.role || 'Colaborador'
          })
        }
      })
      .catch(() => console.error('Erro ao decodificar token'))
  }, [])

  const formatRole = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: 'Administrador',
      MANAGER: 'Gerente',
      RECEPTION: 'Recepção',
      TRAINER: 'Treinador'
    }
    return roles[role] || role
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    document.cookie = 'codefit_token=; path=/; max-age=0'
    router.push('/login')
  }

  const menuItems = [
    {
      text: 'Dashboard',
      iconOutlined: <DashboardOutlinedIcon />,
      iconFilled: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'Alunos',
      iconOutlined: <PeopleOutlinedIcon />,
      iconFilled: <PeopleIcon />,
      path: '/alunos'
    },
    {
      text: 'Funcionários',
      iconOutlined: <BadgeOutlinedIcon />,
      iconFilled: <BadgeIcon />,
      path: '/funcionarios'
    },
    {
      text: 'Planos',
      iconOutlined: <CardMembershipOutlinedIcon />,
      iconFilled: <CardMembershipIcon />,
      path: '/planos'
    },
    {
      text: 'Matrículas',
      iconOutlined: <AssignmentIndOutlinedIcon />,
      iconFilled: <AssignmentIndIcon />,
      path: '/matriculas'
    },
    {
      text: 'Financeiro',
      iconOutlined: <PaymentsOutlinedIcon />,
      iconFilled: <PaymentsIcon />,
      path: '/pagamentos'
    }
  ]

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Image
          src="/logo-1.png"
          alt="Codefit"
          width={260}
          height={35}
          className="object-contain"
        />
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
      <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = pathname.includes(item.path)
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: active
                    ? 'rgba(0, 180, 216, 0.1)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: active
                      ? 'rgba(0, 180, 216, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? 'primary.main' : 'text.secondary',
                    minWidth: 40
                  }}
                >
                  {active ? item.iconFilled : item.iconOutlined}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& span': {
                      color: active ? 'primary.main' : 'text.secondary',
                      fontWeight: active ? 'bold' : 'normal'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, px: 1 }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {user?.name || 'Carregando...'}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              {user ? formatRole(user.role) : '...'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 2 }} />

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: '#ff4d4d', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sair"
              sx={{ '& span': { color: '#ff4d4d' } }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  )

  return (
    <ThemeProvider theme={codefitTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            boxShadow: 'none'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 'bold', color: 'text.primary' }}
            >
              Painel Administrativo
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                bgcolor: 'background.paper',
                borderRight: '1px solid rgba(255,255,255,0.05)'
              }
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                bgcolor: 'background.paper',
                borderRight: '1px solid rgba(255,255,255,0.05)'
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 8
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  )
}
