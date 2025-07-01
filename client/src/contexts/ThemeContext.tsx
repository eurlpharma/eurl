import { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ThemeMode = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';

interface ThemeContextType {
  mode: ThemeMode;
  direction: Direction;
  toggleTheme: () => void;
  setDirection: (dir: Direction) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  direction: 'ltr',
  toggleTheme: () => {},
  setDirection: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as ThemeMode) || 'light';
  });
  
  const [direction, setDirection] = useState<Direction>('ltr');
  const { i18n } = useTranslation();
  
  // Update direction when language changes
  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.setAttribute('dir', dir);
  }, [i18n.language]);
  
  // Save theme mode to localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);
  
  const theme = createTheme({
    direction,
    palette: {
      mode,
      primary: {
        light: '#4dabf5',
        main: '#2196f3',
        dark: '#1769aa',
      },
      secondary: {
        light: '#f73378',
        main: '#f50057',
        dark: '#ab003c',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Open Sans", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Poppins", "Open Sans", "Helvetica", "Arial", sans-serif',
      },
      h2: {
        fontFamily: '"Poppins", "Open Sans", "Helvetica", "Arial", sans-serif',
      },
      h3: {
        fontFamily: '"Poppins", "Open Sans", "Helvetica", "Arial", sans-serif',
      },
      h4: {
        fontFamily: '"Poppins", "Open Sans", "Helvetica", "Arial", sans-serif',
      },
      h5: {
        fontFamily: '"Poppins", "Open Sans", "Helvetica", "Arial", sans-serif',
      },
      h6: {
        fontFamily: '"Poppins", "Open Sans", "Helvetica", "Arial", sans-serif',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'light' 
              ? '0 2px 10px 0 rgba(0, 0, 0, 0.05)' 
              : '0 2px 10px 0 rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  });
  
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  const handleSetDirection = (dir: Direction) => {
    setDirection(dir);
    document.documentElement.setAttribute('dir', dir);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        mode,
        direction,
        toggleTheme,
        setDirection: handleSetDirection,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
