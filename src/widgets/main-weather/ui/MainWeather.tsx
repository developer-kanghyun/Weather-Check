import { SearchBox } from '@/features/search-location';
import { useLocationWeather } from '@/features/weather-fetch';
import { FavoriteToggle } from '@/features/favorite-toggle';
import { useFavorites } from '@/features/favorite-manage';
import type { Location } from '@/entities/location';

interface MainWeatherProps {
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
}

export function MainWeather({ selectedLocation, onSelectLocation }: MainWeatherProps) {
  const { weather, position, isLoading, isError, noData } = useLocationWeather(selectedLocation);
  
  // props 대신 즐겨찾기에서 이름을 가져옴(실시간 동기화)
  const { favorites } = useFavorites();
  const favorite = selectedLocation ? favorites.find(f => f.id === selectedLocation.id) : null;
  const displayName = favorite ? favorite.name : (selectedLocation?.displayLabel || '');
  const originalName = favorite ? favorite.originalName : (selectedLocation?.originalName || selectedLocation?.displayLabel);

  return (
    <main className="flex-1 flex flex-col items-center gap-10 p-12 lg:p-20 overflow-y-auto z-10">
      <header className="w-full max-w-2xl flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-black text-[#111618] dark:text-white drop-shadow-sm">Weather Check</h1>
        <div className="w-full">
          <SearchBox onSelect={onSelectLocation} placeholder="어느 지역의 날씨가 궁금하신가요?" />
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
          <p className="text-lg text-slate-500">지정한 위치의 날씨 정보를 찾을 수 없습니다.</p>
        )}

        {weather && selectedLocation && (
          <div className="glass-panel rounded-[2.5rem] p-10 w-full max-w-md text-center relative shadow-2xl backdrop-blur-md">
            <FavoriteToggle 
              location={selectedLocation} 
              position={position ?? null} 
              className="absolute top-6 right-6" 
            />

            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                {displayName}
              </span>
              
              {originalName && displayName !== originalName && (
                <span className="text-sm text-slate-400">
                  {originalName}
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
              
              <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{weather.current.description || weather.current.main}</p>
              
              <div className="mt-4 flex gap-6 text-sm font-semibold text-slate-500 bg-black/5 px-6 py-2 rounded-full">
                <span>최고 {weather.today.tempMax}°</span>
                <span className="w-px h-4 bg-slate-300" />
                <span>최저 {weather.today.tempMin}°</span>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200/50 w-full">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {weather.hourly.map((hourlyWeather, index) => (
                  <div key={hourlyWeather.dt} className="flex flex-col items-center gap-2 min-w-[60px] p-3 rounded-2xl hover:bg-white/50 transition-colors">
                    <span className="text-xs font-bold text-slate-500">
                      {index === 0 ? '지금' : `${new Date(hourlyWeather.dt * 1000).getHours()}시`}
                    </span>
                    <span className="material-symbols-outlined text-2xl text-slate-600">
                      {hourlyWeather.main === 'Clear' ? 'wb_sunny' : 'cloud'}
                    </span>
                    <span className="text-sm font-bold text-[#111618] dark:text-white">{hourlyWeather.temp}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
