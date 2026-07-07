import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, type PaletteMode, CssBaseline } from '@mui/material';
import { getAppTheme } from '../theme/theme';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
  setMode: (mode: PaletteMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  setMode: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('app-theme-mode');
    return (savedMode as PaletteMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('app-theme-mode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      setMode: (newMode: PaletteMode) => setMode(newMode),
    }),
    [mode]
  );

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
