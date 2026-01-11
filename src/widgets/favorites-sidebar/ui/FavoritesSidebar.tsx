import { useState } from 'react';
import { useFavorites } from '@/features/favorite-manage';
import { useFavoritesWeather } from '@/features/favorites-weather';
import { FavoriteEditField } from '@/features/favorite-edit';
import { type Location, createLocation } from '@/entities/location';
import { getWeatherStyle } from '@/entities/weather/lib/weather-styles';

function formatLocationName(name: string): string {
  return name.split(/[\s-]+/).pop() ?? name;
}

interface FavoritesSidebarProps {
  onSelectLocation: (location: Location) => void;
  selectedLocationId?: string;
}

export function FavoritesSidebar({ onSelectLocation, selectedLocationId }: FavoritesSidebarProps) {
  const { favorites, remove } = useFavorites();
  const { weatherByLocationId } = useFavoritesWeather(favorites);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className={`flex-shrink-0 glass-panel lg:rounded-[2rem] rounded-3xl p-4 lg:p-6 flex flex-col gap-6 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[80vh] flex-1' : 'max-h-[60px]'} lg:max-h-full w-full lg:w-80 lg:h-full`}>
      <div 
        className="flex items-center justify-center lg:justify-between cursor-pointer lg:cursor-default w-full lg:h-auto py-1" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        
        <h2 className="text-base lg:text-lg font-bold text-[#111618] flex items-center justify-center gap-2 w-full lg:w-auto">
          즐겨찾는 지역
        </h2>
        
        <span className={`lg:hidden material-symbols-outlined text-slate-500 absolute right-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
           expand_more
        </span>
      </div>

      <div className={`flex flex-col gap-4 overflow-y-auto ${isExpanded ? 'opacity-100' : 'opacity-0 lg:opacity-100'} transition-opacity duration-300 delay-100`}>
      {favorites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 opacity-60 min-h-[200px]">
          <p className="text-base text-center">즐겨찾는 지역을<br/>추가해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-2">
          {favorites.map((favorite) => {
            const favoriteWeather = weatherByLocationId.get(favorite.id);
            const isSelected = selectedLocationId === favorite.id;
            const isEditingThis = editingId === favorite.id;
            
            const condition = favoriteWeather?.current?.main || 'Clear';
            const style = getWeatherStyle(condition);
            
            const shortName = formatLocationName(favorite.name);
            const shortOriginalName = formatLocationName(favorite.originalName);
            const showSubtitle = shortName !== shortOriginalName;

            return (
              <div
                key={favorite.id}
                className={`group bg-white/50 p-3.5 rounded-2xl text-left transition-all cursor-pointer hover:bg-white/70 flex items-center gap-3 relative ${
                  isSelected ? 'ring-2 ring-inset ring-blue-400 bg-white/80' : ''
                }`}
                onClick={() => {
                   if (!isEditingThis) {
                      onSelectLocation(createLocation({
                        id: favorite.id,
                        parts: [favorite.name],
                        originalName: favorite.originalName,
                        position: { lat: favorite.lat, lon: favorite.lon },
                      }));
                      setIsExpanded(false); // 모바일에서 선택 시 닫기
                   }
                }}
              >
                <div className={`flex-shrink-0 flex items-center justify-center size-10 rounded-full ${style.bg} ${style.color}`}>
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {style.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  {isEditingThis ? (
                    <FavoriteEditField 
                      favoriteId={favorite.id} 
                      currentName={favorite.name}
                      onEditingChange={(editing) => setEditingId(editing ? favorite.id : null)}
                    />
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-[#111618] block truncate">
                          {shortName}
                        </span>
                        {showSubtitle && (
                          <span className="text-xs text-slate-400 block truncate">
                            {shortOriginalName}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex lg:hidden lg:group-hover:flex items-center gap-0.5 flex-shrink-0 transition-all">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setEditingId(favorite.id); 
                          }}
                          className="p-1 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                          title="별명 수정"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); remove(favorite.id); }}
                          className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="삭제"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {favoriteWeather && !isEditingThis && (
                  <div className="text-right flex-shrink-0 min-w-[4.5rem]">
                    <span className="text-xl font-bold text-[#111618] relative -left-[10px] tabular-nums">
                      {favoriteWeather.current.temp}°
                    </span>
                    <div className="flex gap-2 text-[12px] font-medium text-slate-500 justify-end tabular-nums">
                      <span>{favoriteWeather.today?.tempMax ?? '-'}°</span>
                      <span className="text-slate-300 opacity-50">|</span>
                      <span>{favoriteWeather.today?.tempMin ?? '-'}°</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>
    </aside>
  );
}
