import { useLocationWeather } from '@/features/weather-fetch';
import { FavoriteToggle } from '@/features/favorite-toggle';
import { useFavorites } from '@/features/favorite-manage';
import type { Location } from '@/entities/location';
import { formatWeatherDescription, formatTemperature } from '@/entities/weather/lib/weather-format';
import { getWeatherStyle } from '@/entities/weather/lib/weather-styles';

interface MainWeatherProps {
  selectedLocation: Location | null;
}

export function MainWeather({ selectedLocation }: MainWeatherProps) {
  const { weather, position, isLoading, isError } = useLocationWeather(selectedLocation);
  const { favorites } = useFavorites();
  
  const favorite = selectedLocation ? favorites.find(f => f.id === selectedLocation.id) : null;
  const displayName = favorite ? favorite.name : (selectedLocation?.displayLabel || '');
  const originalName = favorite ? favorite.originalName : (selectedLocation?.originalName || selectedLocation?.displayLabel);

  const isCurrentLocation = selectedLocation?.id === 'current-location';
  const displayTitle = isCurrentLocation ? '나의 위치' : displayName;
  const subTitle = isCurrentLocation ? displayName : (originalName && displayName !== originalName ? originalName : null);

  const condition = weather?.current?.main || 'Clear';
  const variant = getWeatherStyle(condition);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto z-10 animate-slide-up">
      <section className="w-full max-w-5xl flex flex-col items-center justify-center min-h-[500px]">
        {isLoading && (
          <div className="glass-panel p-16 rounded-[40px] text-center animate-pulse flex flex-col items-center gap-6 w-full max-w-2xl">
            <span className="material-symbols-outlined text-6xl text-slate-400">cloud</span>
            <p className="text-xl font-medium text-slate-500">날씨 정보를 불러오는 중...</p>
          </div>
        )}

        {isError && (
          <div className="glass-panel p-10 rounded-[40px] text-center">
             <p className="text-red-500 text-xl font-bold">정보 로드 실패</p>
          </div>
        )}

        {weather && selectedLocation && (
          <div className="flex flex-col gap-6 w-full max-w-5xl h-full justify-center">
            <div className="glass-panel relative overflow-hidden rounded-[40px] p-8 lg:p-16 w-full shadow-2xl backdrop-blur-xl border-white/40 flex flex-col justify-between h-[60vh] lg:h-auto min-h-[400px]">


              <div className="relative z-10 flex flex-col gap-1 items-start text-left">
                  <div className="flex items-center gap-3 text-slate-700 mb-2 w-full">
                       {isCurrentLocation && <span className="material-symbols-outlined text-[20px] lg:text-[24px] text-blue-500">my_location</span>}
                       {!isCurrentLocation && <span className="material-symbols-outlined text-[20px] lg:text-[24px] text-slate-500">location_on</span>}
                       <div className="flex items-center gap-3">
                         <span className="text-lg lg:text-3xl font-bold tracking-tight">{displayTitle}</span>
                         {!isCurrentLocation && (
                           <FavoriteToggle 
                             location={selectedLocation} 
                             position={position ?? null} 
                             className="scale-90 lg:scale-100" 
                           />
                         )}
                       </div>
                       {subTitle && <span className="text-sm lg:text-lg font-medium text-slate-500 hidden sm:inline-block">({subTitle})</span>}
                  </div>
                  
                  <h2 className="text-[80px] lg:text-[100px] font-black tracking-tighter text-[#111618] leading-[0.9] -ml-2 lg:-ml-4 drop-shadow-sm tabular-nums">
                    {formatTemperature(weather.current.temp)}
                  </h2>
                  
                  <p className="text-2xl lg:text-4xl font-bold text-slate-700 capitalize mt-2">
                    {formatWeatherDescription(weather.current.main, weather.current.description)}
                  </p>

                  <div className="mt-4 flex gap-3 text-base lg:text-xl font-medium text-slate-500 tabular-nums">
                      <span>최고: {formatTemperature(weather.today.tempMax)}</span>
                      <span>최저: {formatTemperature(weather.today.tempMin)}</span>
                  </div>
              </div>

              <div className="absolute -bottom-10 -right-10 lg:bottom-10 lg:right-20 flex shrink-0 items-center justify-center pointer-events-none">
                  <div className="relative size-64 lg:size-96">
                      <div className={`absolute inset-0 m-auto size-48 lg:size-72 animate-pulse rounded-full blur-3xl opacity-50 ${variant.glow}`}></div>
                      
                      <span 
                        className={`material-symbols-outlined absolute inset-0 m-auto flex items-center justify-center text-[200px] lg:text-[300px] drop-shadow-2xl ${variant.color}`}
                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
                      >
                          {variant.icon}
                      </span>
                  </div>
              </div>
            </div>

          </div>
        )}
      </section>
    </main>
  );
}


