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
          <div className="flex flex-col gap-6 w-full max-w-5xl">
            <div className="glass-panel relative overflow-hidden rounded-[50px] p-12 lg:p-20 w-full shadow-2xl backdrop-blur-xl border-white/40">
              {!isCurrentLocation && (
                <FavoriteToggle 
                  location={selectedLocation} 
                  position={position ?? null} 
                  className="absolute top-10 right-10 z-20 scale-150" 
                />
              )}

              <div className="relative z-10 flex flex-col justify-between gap-12 lg:flex-row lg:items-center">
                  <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-slate-700">
                          {isCurrentLocation && <span className="material-symbols-outlined text-[32px] text-blue-500">my_location</span>}
                          <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">{displayTitle}</span>
                      </div>
                      {subTitle && <span className="text-xl font-medium text-slate-500">{subTitle}</span>}
                      
                      <h2 className="mt-4 text-[120px] lg:text-[100px] font-black tracking-tighter text-[#111618] leading-none">
                        {formatTemperature(weather.current.temp)}
                      </h2>
                      <p className="text-3xl lg:text-4xl font-bold text-slate-700 capitalize">
                        {formatWeatherDescription(weather.current.main, weather.current.description)}
                      </p>
                      <div className="mt-8 flex gap-8 text-xl lg:text-2xl font-bold text-slate-500 bg-white/40 py-3 px-8 rounded-full w-fit">
                          <span>최고 {formatTemperature(weather.today.tempMax)}</span>
                          <span className="w-px h-8 bg-slate-300 self-center" />
                          <span>최저 {formatTemperature(weather.today.tempMin)}</span>
                      </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-center">
                      <div className="relative size-64 lg:size-96">
                          <div className={`absolute inset-0 m-auto size-48 animate-pulse rounded-full blur-3xl opacity-60 ${variant.glow}`}></div>
                          
                          <span 
                            className={`material-symbols-outlined absolute inset-0 m-auto flex items-center justify-center text-[150px] lg:text-[150px] drop-shadow-2xl ${variant.color}`}
                            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
                          >
                              {variant.icon}
                          </span>
                      </div>
                  </div>
              </div>
            </div>

          </div>
        )}
      </section>
    </main>
  );
}


