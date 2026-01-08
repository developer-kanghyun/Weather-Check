import { useState } from 'react';
import { useFavorites } from '@/features/favorite-manage';
import { useFavoritesWeather } from '@/features/favorites-weather';
import { FavoriteEditField } from '@/features/favorite-edit';
import type { Location } from '@/entities/location';

interface FavoritesSidebarProps {
  onSelectLocation: (location: Location) => void;
  selectedLocationId?: string;
}

export function FavoritesSidebar({ onSelectLocation, selectedLocationId }: FavoritesSidebarProps) {
  const { favorites, remove } = useFavorites();
  const { weatherByLocationId } = useFavoritesWeather(favorites);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <aside className="w-80 h-screen sticky top-0 flex-shrink-0 p-6 glass-panel border-r border-white/10 flex flex-col gap-6 overflow-y-auto z-20">
      <h2 className="text-xl font-extrabold text-[#111618] dark:text-white flex items-center gap-2">
        즐겨찾기
      </h2>

      {favorites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 opacity-60">
          <span className="material-symbols-outlined text-4xl">bookmark_add</span>
          <p className="text-sm text-center">즐겨찾는 지역을<br/>추가해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {favorites.map((favorite) => {
            const favoriteWeather = weatherByLocationId.get(favorite.id);
            const isSelected = selectedLocationId === favorite.id;
            const isEditingThis = editingId === favorite.id;

            return (
              <div
                key={favorite.id}
                className={`glass-panel p-4 rounded-xl text-left transition-all group relative flex justify-between items-start cursor-pointer hover:bg-white/20 ${
                  isSelected ? 'ring-2 ring-blue-500 bg-white/30' : ''
                }`}
                onClick={() => !isEditingThis && onSelectLocation({
                  id: favorite.id,
                  displayLabel: favorite.name,
                  originalName: favorite.originalName,
                  parts: [favorite.name],
                  depth: 0,
                  position: { lat: favorite.lat, lon: favorite.lon },
                })}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    {isEditingThis ? (
                      <FavoriteEditField 
                        favoriteId={favorite.id} 
                        currentName={favorite.name}
                        onEditingChange={(editing) => setEditingId(editing ? favorite.id : null)}
                      />
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-lg text-[#111618] dark:text-white block truncate">
                            {favorite.name}
                          </span>
                          {favorite.name !== favorite.originalName && (
                            <span className="text-sm text-slate-400 block truncate">
                              {favorite.originalName}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setEditingId(favorite.id); 
                            }}
                            className="p-1 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center"
                            title="별명 수정"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); remove(favorite.id); }}
                            className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center"
                            title="삭제"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {favoriteWeather && !isEditingThis && (
                  <div className="text-right flex-shrink-0">
                    <span className="text-xl font-bold text-[#111618] dark:text-white">
                      {favoriteWeather.current.temp}°
                    </span>
                    <div className="flex gap-2 text-[10px] text-slate-500">
                      <span>최고 {favoriteWeather.today.tempMax}°</span>
                      <span>최저 {favoriteWeather.today.tempMin}°</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
