import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location } from '@/entities/location';
import { FavoritesSidebar } from '@/widgets/favorites-sidebar';
import { MainWeather } from '@/widgets/main-weather';
import { useLocationWeather } from '@/features/weather-fetch';
import { weatherThemes, type WeatherStatus } from '@/shared/lib/weather-theme';

export function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const navigate = useNavigate();
  
  const { weather } = useLocationWeather(selectedLocation);
  const weatherStatus: WeatherStatus = (weather?.current?.main as WeatherStatus) || 'Clear';
  const theme = weatherThemes[weatherStatus] ?? weatherThemes.Clear;

  const handleSelectLocation = useCallback((location: Location) => {
    // 검색 결과를 선택할 때, 좌표와 함께 상세 페이지로 이동 (즐겨찾기 되지 않은 경우 name 쿼리를 포함)
    const params = new URLSearchParams({
      lat: String(location.position?.lat),
      lon: String(location.position?.lon),
      name: location.displayLabel
    });
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
