import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/shared/context/ThemeContext';
import { weatherThemes } from '@/shared/lib/weather-theme';
import { FavoritesSidebar } from '@/widgets/favorites-sidebar';
import type { Location } from '@/entities/location';

export function MainLayout() {
  const { weatherStatus } = useTheme();
  const { locationId } = useParams<{ locationId: string }>();
  const theme = weatherThemes[weatherStatus] ?? weatherThemes.Clear;
  const navigate = useNavigate();

  function handleSelectLocation(location: Location) {
    const params = new URLSearchParams();
    if (location.position?.lat) params.set('lat', String(location.position.lat));
    if (location.position?.lon) params.set('lon', String(location.position.lon));
    params.set('name', location.displayLabel);
    
    navigate(`/detail/${location.id}?${params.toString()}`);
  }

  // 배경을 전역으로 관리하여 페이지 전환 시 깜빡임 방지
  return (
    <div className="flex min-h-screen relative overflow-hidden text-[#111618] dark:text-white">
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      <div 
        className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-1000`} 
      />

      <div className="relative z-10 flex w-full">
        <FavoritesSidebar 
          onSelectLocation={handleSelectLocation}
          selectedLocationId={locationId} 
        />
        
        <Outlet />
      </div>
    </div>
  );
}
