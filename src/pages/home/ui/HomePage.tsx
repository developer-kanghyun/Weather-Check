import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Location, createLocation } from '@/entities/location';
import { MainWeather } from '@/widgets/main-weather';
import { useLocationWeather } from '@/features/weather-fetch';
import { useCurrentPosition } from '@/features/geolocation';
import { reverseGeocode } from '@/shared/api/weather';
import { type WeatherStatus } from '@/shared/lib/weather-theme';
import { useTheme } from '@/shared/context/ThemeContext';

export function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hasInitialLocation, setHasInitialLocation] = useState(false);
  const navigate = useNavigate();
  const { data: currentPosition } = useCurrentPosition();
  const { setWeatherStatus } = useTheme();
  
  // 초기 진입 시 현재 위치를 파악하여 날씨 데이터를 로드
  useEffect(() => {
    async function setInitialLocation() {
      if (currentPosition && !hasInitialLocation) {
        let currentAddress = '현재 위치';
        
        try {
          const geoResults = await reverseGeocode({ 
            lat: currentPosition.lat, 
            lon: currentPosition.lon 
          });
          
          if (geoResults && geoResults[0]) {
            const { name, state, local_names } = geoResults[0];
            const koName = local_names?.ko || name;
            currentAddress = state ? `${state} ${koName}` : koName;
          }
        } catch (error) {
          console.error('역지오코딩 실패:', error);
        }

        setSelectedLocation(createLocation({
          id: 'current-location',
          parts: [currentAddress],
          originalName: currentAddress,
          position: { lat: currentPosition.lat, lon: currentPosition.lon },
        }));
        setHasInitialLocation(true);
      }
    }
    
    setInitialLocation();
  }, [currentPosition, hasInitialLocation]);

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
