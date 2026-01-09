import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Location, createLocation } from '@/entities/location';
import { FavoritesSidebar } from '@/widgets/favorites-sidebar';
import { MainWeather } from '@/widgets/main-weather';
import { useLocationWeather } from '@/features/weather-fetch';
import { useCurrentPosition } from '@/features/geolocation';
import { reverseGeocode } from '@/shared/api/weather';
import { weatherThemes, type WeatherStatus } from '@/shared/lib/weather-theme';

export function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hasInitialLocation, setHasInitialLocation] = useState(false);
  const navigate = useNavigate();
  const { data: currentPosition } = useCurrentPosition();
  
  // 앱 첫 진입 시 현재 위치를 자동으로 선택, 지명 파악
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
            // state는 번역이 안 될 수도 있으므로, 영어라면 생략하거나 그대로 표시
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
  const weatherStatus: WeatherStatus = (weather?.current?.main as WeatherStatus) || 'Clear';
  const theme = weatherThemes[weatherStatus] ?? weatherThemes.Clear;

  const handleSelectLocation = useCallback((location: Location) => {
    // 유효한 좌표만 URL 파라미터에 포함
    const params = new URLSearchParams();
    if (location.position?.lat) params.set('lat', String(location.position.lat));
    if (location.position?.lon) params.set('lon', String(location.position.lon));
    params.set('name', location.displayLabel);
    
    navigate(`/detail/${location.id}?${params.toString()}`);
  }, [navigate]);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-700`} />

      <div className="relative z-10 flex w-full">
        <FavoritesSidebar 
          onSelectLocation={handleSelectLocation}
          selectedLocationId={selectedLocation?.id}
        />
        <MainWeather 
          selectedLocation={selectedLocation} 
          onSelectLocation={handleSelectLocation} 
        />
      </div>
    </div>
  );
}
