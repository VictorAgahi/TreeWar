import { createTheme, type PaletteMode } from '@mui/material/styles';

export const getAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#2e7d32' : '#81c784', // Forest green / Light green
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: mode === 'light' ? '#d32f2f' : '#e57373', // Heatwave red / Light red
      light: '#ff6659',
      dark: '#9a0007',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
          backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});
