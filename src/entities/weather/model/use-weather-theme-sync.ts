import { useEffect } from 'react';
import { useTheme } from '@/shared/context/ThemeContext';
import { type WeatherStatus } from '@/shared/lib/weather-theme';

// 날씨 데이터의 변화를 감지하여 앱 전체 테마를 동기화
export const useWeatherThemeSync = (status?: string) => {
  const { setWeatherStatus } = useTheme();

  useEffect(() => {
    if (status) {
      setWeatherStatus(status as WeatherStatus);
    }
  }, [status, setWeatherStatus]);
}
