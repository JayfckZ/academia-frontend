"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const codefitTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8',
      contrastText: '#0d0d0d'
    },
    background: {
      default: '#0d0d0d',
      paper: '#151515'
    },
    text: {
      primary: '#ffffff',
      secondary: '#8a9bb0'
    }
  },
  typography: {
    fontFamily: 'var(--font-roboto), Roboto, sans-serif',
    button: {
      fontWeight: 700,
      letterSpacing: '1px'
    }
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00b4d8'
            }
          }
        }
      }
    }
  }
})

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Erro ao realizar login.')
        setLoading(false)
        return
      }

      document.cookie = `codefit_token=${data.token}; path=/; max-age=28800; samesite=strict`

      router.push('/dashboard')
    } catch (err) {
      setError('Erro de conexão com o servidor.')
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={codefitTheme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 180, 216, 0.1) 0%, transparent 50%)'
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: { xs: 4, md: 6 },
            width: '100%',
            maxWidth: 450,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Image
              src="/logo-1.png"
              alt="Codefit Dashboard"
              width={260}
              height={45}
              className="object-contain"
            />
          </Box>

          <Typography variant="h5" component="h1" gutterBottom sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            Acesso Restrito
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Insira suas credenciais para acessar o painel administrativo da Codefit.
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail Corporativo"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{
                input: {
                  sx: { fontFamily: 'var(--font-fira-code), monospace', fontSize: '0.9rem' }
                }
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  sx: { fontFamily: 'var(--font-fira-code), monospace', fontSize: '0.9rem' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={!loading && <LockOutlinedIcon />}
              sx={{ mt: 4, mb: 2, py: 1.5 }}
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                Esqueceu a senha?
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}
