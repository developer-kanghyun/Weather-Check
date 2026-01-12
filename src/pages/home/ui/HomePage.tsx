import { useEffect } from 'react';
import { MainWeather } from '@/widgets/main-weather';
import { useLocationWeather } from '@/features/weather-fetch';
import { type WeatherStatus } from '@/shared/lib/weather-theme';
import { useTheme } from '@/shared/context/ThemeContext';
import { useCurrentLocation } from '@/features/geolocation';

export const HomePage = () => {
  const { selectedLocation } = useCurrentLocation();
  const { setWeatherStatus } = useTheme();
  const { weather } = useLocationWeather(selectedLocation);

  useEffect(() => {
    const status: WeatherStatus = (weather?.current?.main as WeatherStatus) || 'Clear';
    setWeatherStatus(status);
  }, [weather, setWeatherStatus]);


  return (
    <MainWeather
      selectedLocation={selectedLocation}
    />
  );
}
