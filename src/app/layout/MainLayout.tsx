import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '@/shared/context/ThemeContext';
import { weatherThemes } from '@/shared/lib/weather-theme';
import { FavoritesSidebar } from '@/widgets/favorites-sidebar';
import type { Location } from '@/entities/location';
import { useFavorites } from '@/features/favorite-manage';
import { AppHeader } from '@/widgets/app-header';

export const MainLayout = () => {
  const { weatherStatus } = useTheme();
  const { locationId } = useParams<{ locationId: string }>();
  const location = useLocation();
  const theme = weatherThemes[weatherStatus] ?? weatherThemes.Clear;
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const isHomePage = location.pathname === '/';

  const handleSelectLocation = (location: Location) => {
    const favorite = favorites.find(f => f.id === location.id);
    const title = favorite?.name || location.displayLabel;
    
    const params = new URLSearchParams();
    if (location.position?.lat) params.set('lat', String(location.position.lat));
    if (location.position?.lon) params.set('lon', String(location.position.lon));
    
    params.set('name', title);
    params.set('address', location.fullAddress);
    
    navigate(`/detail/${location.id}?${params.toString()}`);
  }

  // 배경을 전역으로 관리하여 페이지 전환 시 깜빡임 방지
  return (
    <div className="flex flex-col h-screen relative overflow-hidden text-[#111618] dark:text-white gap-2">
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      <div 
        className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-1000`} 
      />

      <AppHeader onSelectLocation={handleSelectLocation} />

      <div className={`relative z-10 flex flex-col lg:flex-row flex-1 w-full overflow-hidden px-6 pb-6 lg:gap-6 ${isHomePage ? 'gap-8' : 'gap-3'}`}>
        <FavoritesSidebar 
          onSelectLocation={handleSelectLocation}
          selectedLocationId={locationId} 
        />
        
        <div className="flex-1 min-w-0 h-full overflow-y-auto rounded-3xl  lg:pb-0">
           <Outlet />
        </div>
      </div>
    </div>
  );
}
