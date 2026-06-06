import { createTheme } from '@mui/material/styles'

export const codefitTheme = createTheme({
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
