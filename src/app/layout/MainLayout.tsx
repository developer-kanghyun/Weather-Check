import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@/shared/context/ThemeContext';
import { weatherThemes } from '@/shared/lib/weather-theme';
import { FavoritesSidebar } from '@/widgets/favorites-sidebar';
import { SearchBox } from '@/features/search-location';
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
    <div className="flex flex-col h-screen relative overflow-hidden text-[#111618] dark:text-white">
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-1000 pointer-events-none"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      <div 
        className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-1000`} 
      />

      <header className="relative z-20 flex-shrink-0 px-6 pt-6 pb-2">
        <div className="glass-panel rounded-full px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
             <span className="material-symbols-outlined text-3xl text-blue-500">cloud</span>
             <span className="text-xl font-extrabold tracking-tight">Weather Check</span>
          </div>
          
          <div className="w-full max-w-xl mx-auto absolute left-0 right-0">
             <SearchBox onSelect={handleSelectLocation} placeholder="지역을 검색하세요" />
          </div>
          
          <div className="w-[100px]"></div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 w-full overflow-hidden p-6 gap-3">
        <FavoritesSidebar 
          onSelectLocation={handleSelectLocation}
          selectedLocationId={locationId} 
        />
        
        <div className="flex-1 min-w-0 h-full overflow-y-auto rounded-3xl">
           <Outlet />
        </div>
      </div>
    </div>
  );
}
