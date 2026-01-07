import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchBox } from '@/features/search-location';
import { useLocationWeather, useFavoritesWeather } from '@/features/weather-fetch';
import { useFavorites } from '@/features/favorite-manage';
import { WEATHER_THEMES, type WeatherStatus } from '@/shared/lib/weather-theme';
import type { Location } from '@/entities/location';
import type { Favorite } from '@/entities/favorite';

function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { weather, position, isLoading, isError, noData } = useLocationWeather(selectedLocation);
  const { favorites, add, remove, update } = useFavorites();
  const { weatherByLocationId } = useFavoritesWeather(favorites);

  const [editingFavoriteId, setEditingFavoriteId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const weatherStatus: WeatherStatus = (weather?.current.main as WeatherStatus) || 'Clear';
  const theme = WEATHER_THEMES[weatherStatus] ?? WEATHER_THEMES.Clear;

  const isFavorite = selectedLocation 
    ? favorites.some(f => f.id === selectedLocation.id)
    : false;

  const handleToggleFavorite = () => {
    if (!selectedLocation || !position) return;
    
    if (isFavorite) {
      handleRemoveFavorite(selectedLocation.id);
    } else {
      const result = add({
        id: selectedLocation.id,
        name: selectedLocation.displayLabel,
        originalName: selectedLocation.originalName || selectedLocation.displayLabel,
        lat: position.lat,
        lon: position.lon,
      });
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleSelectFavorite = (favorite: Favorite) => {
    setSelectedLocation({
      id: favorite.id,
      displayLabel: favorite.name,
      originalName: favorite.originalName,
      parts: [favorite.name],
      depth: 0,
      position: { lat: favorite.lat, lon: favorite.lon },
    });
  };

  const handleSelectLocation = (location: Location) => {
    const favorite = favorites.find(f => f.id === location.id);
    
    if (favorite) {
      setSelectedLocation({
        ...location,
        displayLabel: favorite.name,
        originalName: favorite.originalName,
        position: { lat: favorite.lat, lon: favorite.lon }
      });
    } else {
      setSelectedLocation(location);
    }
  };

  const handleStartEditFavorite = (favoriteId: string, currentName: string) => {
    setEditingFavoriteId(favoriteId);
    setEditingName(currentName);
  };

  const handleSaveEditFavorite = (favoriteId: string) => {
    if (editingName.trim() !== '') {
      update(favoriteId, { name: editingName.trim() });
      
      // 사이드바에서 별명을 지을 때, 오른쪽에 같은 지역이라면 즉시 변경사항 반영
      if (selectedLocation?.id === favoriteId) {
        const currentFav = favorites.find(f => f.id === favoriteId);
        if (currentFav) {
          setSelectedLocation(prev => prev ? { 
            ...prev, 
            displayLabel: editingName.trim(),
            position: { lat: currentFav.lat, lon: currentFav.lon }
          } : null);
        }
      }
    }
    setEditingFavoriteId(null);
  };

  const handleCancelEditFavorite = () => {
    setEditingFavoriteId(null);
    setEditingName('');
  };

  const handleRemoveFavorite = (favoriteId: string) => {
    const deletingFavorite = favorites.find(f => f.id === favoriteId);
    remove(favoriteId);
    
    if (deletingFavorite && selectedLocation?.id === favoriteId) {
      setSelectedLocation(prev => prev ? {
        ...prev,
        displayLabel: deletingFavorite.originalName,
        originalName: undefined,
      } : null);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-700`} />

      <div className="relative z-10 flex min-h-screen">
        
        <aside className="w-80 h-screen sticky top-0 flex-shrink-0 p-6 glass-panel border-r border-white/10 flex flex-col gap-6 overflow-y-auto">
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
                const isEditingThisFavorite = editingFavoriteId === favorite.id;

                return (
                  <button
                    key={favorite.id}
                    onClick={() => !isEditingThisFavorite && handleSelectFavorite(favorite)}
                    className="glass-panel p-4 rounded-xl text-left hover:bg-white/20 transition-all group relative flex justify-between items-start"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        {isEditingThisFavorite ? (
                          <>
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEditFavorite(favorite.id);
                                if (e.key === 'Escape') handleCancelEditFavorite();
                              }}
                              autoFocus
                              className="flex-1 font-bold text-[#111618] dark:text-white bg-white/50 dark:bg-black/30 px-2 py-1 rounded border border-blue-500 outline-none min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleSaveEditFavorite(favorite.id); }}
                                className="p-1 rounded-full text-green-600 hover:bg-green-50 transition-colors"
                                title="저장"
                              >
                                <span className="material-symbols-outlined text-[18px]">check</span>
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleCancelEditFavorite(); }}
                                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
                                title="취소"
                              >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-lg text-[#111618] dark:text-white block truncate">{favorite.name}</span>
                              {favorite.name !== favorite.originalName && (
                                <span className="text-sm text-slate-400 block truncate">{favorite.originalName}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleStartEditFavorite(favorite.id, favorite.name); 
                                }}
                                className="p-1 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center"
                                title="별칭 수정"
                              >
                                <span className="material-symbols-outlined text-[14px]">edit</span>
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(favorite.id); }}
                                className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
                                title="삭제"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {favoriteWeather && !isEditingThisFavorite && (
                      <div className="text-right flex-shrink-0">
                        <span className="text-xl font-bold text-[#111618] dark:text-white">{favoriteWeather.current.temp}°</span>
                        <div className="flex gap-2 text-[10px] text-slate-500">
                          <span>최고 {favoriteWeather.today.tempMax}°</span>
                          <span>최저 {favoriteWeather.today.tempMin}°</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <main className="flex-1 flex flex-col items-center gap-10 p-12 lg:p-20 overflow-y-auto">
          <header className="w-full max-w-2xl flex flex-col gap-8 items-center">
            <h1 className="text-4xl font-black text-[#111618] dark:text-white drop-shadow-sm">Weather Check</h1>
            <div className="w-full">
              <SearchBox onSelect={handleSelectLocation} placeholder="어느 지역의 날씨가 궁금하신가요?" />
            </div>
          </header>

          <section className="w-full flex-1 flex flex-col items-center justify-center min-h-[400px]">
            {!selectedLocation && (
              <div className="text-center text-slate-600 dark:text-slate-200 opacity-80">
                <span className="material-symbols-outlined text-6xl mb-4">public</span>
                <p className="text-xl font-medium">지역을 검색해 주세요</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center animate-pulse">
                <span className="material-symbols-outlined text-5xl text-slate-500 mb-2">cloud_sync</span>
                <p className="text-lg text-slate-500">날씨 정보를 불러오는 중...</p>
              </div>
            )}

            {isError && (
              <p className="text-lg text-red-500 bg-red-100/80 px-4 py-2 rounded-lg">
                날씨 정보를 불러오는 데 실패했습니다.
              </p>
            )}

            {noData && selectedLocation && (
              <p className="text-lg text-slate-600 dark:text-slate-300">
                해당 장소의 정보가 제공되지 않습니다.
              </p>
            )}

            {weather && selectedLocation && (
              <div className="glass-panel rounded-[2.5rem] p-10 w-full max-w-md text-center relative shadow-2xl backdrop-blur-md">
                <button 
                  onClick={handleToggleFavorite}
                  className={`absolute top-6 right-6 p-2 rounded-full transition-all ${
                    isFavorite ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <span className={`material-symbols-outlined ${isFavorite ? 'fill-1' : ''}`}>
                    {isFavorite ? 'star' : 'star_border'}
                  </span>
                </button>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                    {selectedLocation.displayLabel}
                  </span>
                  
                  {selectedLocation.originalName && selectedLocation.displayLabel !== selectedLocation.originalName && (
                    <span className="text-sm text-slate-400">
                      {selectedLocation.originalName}
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-7xl font-black text-[#111618] dark:text-white">{weather.current.temp}°</span>
                    <span className="material-symbols-outlined text-7xl text-blue-500">
                       {weather.current.main === 'Clear' ? 'wb_sunny' : 
                        weather.current.main === 'Clouds' ? 'cloud' : 
                        weather.current.main === 'Rain' ? 'rainy' : 'cloud'}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{weather.current.description}</p>
                  
                  <div className="mt-4 flex gap-6 text-sm font-semibold text-slate-500 bg-black/5 px-6 py-2 rounded-full">
                    <span>최고 {weather.today.tempMax}°</span>
                    <span className="w-px h-4 bg-slate-300" />
                    <span>최저 {weather.today.tempMin}°</span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-200/50 w-full">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {weather.hourly.map((hourlyWeather, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 min-w-[60px] p-3 rounded-2xl hover:bg-white/50 transition-colors">
                        <span className="text-xs font-bold text-slate-500">
                          {index === 0 ? '지금' : `${new Date(hourlyWeather.dt * 1000).getHours()}시`}
                        </span>
                        <span className="material-symbols-outlined text-2xl text-slate-600">
                          {hourlyWeather.main === 'Clear' ? 'wb_sunny' : 'cloud'}
                        </span>
                        <span className="text-sm font-bold text-[#111618]">{hourlyWeather.temp}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
