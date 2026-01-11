import { useNavigate } from 'react-router-dom';
import { SearchBox } from '@/features/search-location';
import type { Location } from '@/entities/location';

interface AppHeaderProps {
  onSelectLocation: (location: Location) => void;
}

export function AppHeader({ onSelectLocation }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="relative z-20 flex-shrink-0 px-6 pt-6 pb-2">
      {/* 모바일(심플한 헤더) */}
      <div className="lg:hidden glass-panel rounded-full px-4 py-2 flex items-center gap-4 shadow-sm bg-white/60">
        <div 
          className="size-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 flex-shrink-0 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined text-xl">cloud</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <SearchBox onSelect={onSelectLocation} placeholder="지역을 검색하세요" />
        </div>
      </div>

      {/* 데스크탑 헤더 */}
      <div className="hidden lg:flex glass-panel rounded-full px-8 py-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-3xl text-blue-500">cloud</span>
          <span className="text-xl font-extrabold tracking-tight">Weather Check</span>
        </div>
        
        <div className="w-full max-w-xl mx-auto absolute left-0 right-0 pointer-events-none">
          <div className="pointer-events-auto">
            <SearchBox onSelect={onSelectLocation} placeholder="지역을 검색하세요" />
          </div>
        </div>
        
        <div className="w-[100px]"></div>
      </div>
    </header>
  );
}
