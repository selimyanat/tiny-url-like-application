// src/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#6A0DAD', // Purple
    },
    secondary: {
      main: '#FFD700', // Gold
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333',
      secondary: '#666',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h4: {
      fontWeight: 'bold',
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation
      fontWeight: 'bold',
    },
  },
  shape: {
    borderRadius: 12, // Default border radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px', // All buttons will have rounded corners
          padding: '12px 24px', // Standard button padding
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: '24px', // Default container padding
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontWeight: 'bold',
          fontSize: '2rem',
          textAlign: 'center',
          color: '#333',
        },
      },
    },
  },
};

export default createTheme(theme);
