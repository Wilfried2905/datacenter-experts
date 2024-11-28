import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#FF9900',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
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
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#001A33',
    },
    secondary: {
      main: '#CC7A00',
    },
    background: {
      default: '#001A33',
      paper: '#1A2937',
    },
    text: {
      primary: '#E0E0E0',
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
});
