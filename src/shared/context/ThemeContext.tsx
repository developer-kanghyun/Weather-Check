import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { WeatherStatus } from '@/shared/lib/weather-theme';

interface ThemeContextType {
  weatherStatus: WeatherStatus;
  setWeatherStatus: (status: WeatherStatus) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [weatherStatus, setWeatherStatus] = useState<WeatherStatus>('Clear');

  const value = useMemo(() => ({
    weatherStatus,
    setWeatherStatus
  }), [weatherStatus]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
