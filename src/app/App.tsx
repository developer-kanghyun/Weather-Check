import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesSidebar } from '@/widgets/favorites-sidebar';
import { MainWeather } from '@/widgets/main-weather';
import { useLocationWeather } from '@/features/weather-fetch';
import { FavoritesProvider } from '@/features/favorite-manage';
import { WEATHER_THEMES, type WeatherStatus } from '@/shared/lib/weather-theme';
import type { Location } from '@/entities/location';

function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { weather } = useLocationWeather(selectedLocation);


  const weatherStatus: WeatherStatus = (weather?.current.main as WeatherStatus) || 'Clear';
  const theme = WEATHER_THEMES[weatherStatus] ?? WEATHER_THEMES.Clear;

  const handleSelectLocation = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

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

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
