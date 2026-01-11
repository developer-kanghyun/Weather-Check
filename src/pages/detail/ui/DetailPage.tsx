import { useNavigate, useParams } from 'react-router-dom';
import { useLocationWeather } from '@/features/weather-fetch';
import { FavoriteToggle } from '@/features/favorite-toggle';
import { formatWeatherDescription, formatTemperature } from '@/entities/weather/lib/weather-format';
import { useEffect } from 'react';
import { useTheme } from '@/shared/context/ThemeContext';
import { type WeatherStatus } from '@/shared/lib/weather-theme';
import { createLocation } from '@/entities/location';
import { getWeatherStyle } from '@/entities/weather/lib/weather-styles';

export function DetailPage() {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { setWeatherStatus } = useTheme();


  const searchParams = new URLSearchParams(window.location.search);
  const locationName = searchParams.get('name');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');


  const locationParts = (locationName || 'Unknown').split(/[\s-]+/).map(s => s.trim()).filter(Boolean);
  const location = createLocation({
    id: locationId || 'unknown',
    parts: locationParts,
    originalName: locationName || undefined,
    position: lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : undefined
  });

  const { weather, position, isLoading, isError } = useLocationWeather(location);

  useEffect(() => {
    if (weather?.current?.main) {
        setWeatherStatus(weather.current.main as WeatherStatus);
    }
  }, [weather, setWeatherStatus]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <span className="material-symbols-outlined text-6xl text-white/50">cloud</span>
            <p className="text-white/70 font-bold">날씨 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !weather) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="glass-panel p-8 rounded-3xl text-center">
            <p className="text-red-500 font-bold text-lg mb-2">해당 장소의 정보가 제공되지 않습니다.</p>
            <button onClick={() => navigate('/')} className="text-sm underline opacity-60 hover:opacity-100">홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  const currentVariant = getWeatherStyle(weather.current.main);

  return (
    <main className="flex-1 p-4 lg:p-6 overflow-y-auto animate-slide-up flex flex-col gap-4 max-w-full">
      <header className="flex items-center gap-3 pb-2">
        <button 
          onClick={() => navigate('/')}
          className="flex size-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-md text-[#111618] flex-shrink-0"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="flex items-center gap-3 px-2 flex-1 min-w-0">
            <h1 className="text-xl lg:text-3xl font-extrabold text-[#111618] truncate">{locationName || 'Unknown Location'}</h1>
            <FavoriteToggle location={location} position={position ?? null} className="flex-shrink-0" />
        </div>
      </header>

      <section className="glass-panel relative overflow-hidden rounded-3xl p-6 lg:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-[#111618] tabular-nums">
                  {formatTemperature(weather.current.temp)}
                </h2>
                <p className="text-xl md:text-2xl font-bold text-slate-700 capitalize">
                  {formatWeatherDescription(weather.current.main, weather.current.description)}
                </p>
                <div className="mt-2 md:mt-4 flex gap-4 text-sm font-medium text-slate-500 tabular-nums">
                    <span>최고: {formatTemperature(weather.today.tempMax)}</span>
                    <span>최저: {formatTemperature(weather.today.tempMin)}</span>
                </div>
            </div>
            <div className="flex shrink-0 items-center justify-center">
                <div className="relative size-32 md:size-48">
                    <div className={`absolute inset-0 m-auto size-24 md:size-28 animate-pulse rounded-full blur-2xl opacity-60 ${currentVariant.glow}`}></div>
                    
                    <span 
                      className={`material-symbols-outlined absolute inset-0 m-auto flex items-center justify-center text-[100px] md:text-[160px] drop-shadow-xl ${currentVariant.color}`}
                      style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}
                    >
                        {currentVariant.icon}
                    </span>
                </div>
            </div>
        </div>
      </section>

      <section className="glass-panel w-full overflow-hidden rounded-3xl p-5">
        <h4 className="mb-4 text-lg font-bold text-[#111618]">시간별 예보</h4>
        <div className="flex w-full gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
          {weather.hourly?.slice(0, 24).map((hour: any, index: number) => {
             const variant = getWeatherStyle(hour.weather?.[0]?.main);
             return (
                <div 
                  key={hour.dt} 
                  className={`flex min-w-[80px] flex-col items-center gap-1 rounded-3xl p-4 md:p-5 transition snap-start ${
                    index === 0 
                      ? 'bg-blue-100/50 border border-blue-200/50' 
                      : 'hover:bg-white/40'
                  }`}
                >
                  <span className={`text-xs md:text-sm font-medium whitespace-nowrap ${index === 0 ? 'text-slate-700' : 'text-slate-500'}`}>
                    {index === 0 ? '지금' : new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', hour12: true }).format(new Date(hour.dt * 1000))}
                  </span>
                  <span className={`material-symbols-outlined text-2xl md:text-3xl drop-shadow-sm ${variant.color}`}>
                    {variant.icon}
                  </span>
                  <span className="text-base md:text-lg font-bold text-[#111618] tabular-nums">{Math.round(hour.temp)}°</span>
                </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">

        <div className="glass-panel flex flex-col items-start gap-3 rounded-3xl p-5 lg:p-6 transition-transform hover:-translate-y-1 h-40 lg:h-44 justify-between bg-blue-50/50">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <span className="material-symbols-outlined">water_drop</span>
            </div>
            <div>
                <span className="text-sm font-medium text-slate-500 mb-1 block">습도</span>
                <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">{weather.current.humidity}%</p>
            </div>
        </div>
        

        <div className="glass-panel flex flex-col items-start gap-3 rounded-3xl p-5 lg:p-6 transition-transform hover:-translate-y-1 h-40 lg:h-44 justify-between bg-teal-50/50">
            <div className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-500">
                <span className="material-symbols-outlined">air</span>
            </div>
            <div>
                <span className="text-sm font-medium text-slate-500 mb-1 block">바람</span>
                <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">{Math.round(weather.current.wind_speed)}m/s</p>
            </div>
        </div>
        

        <div className="glass-panel flex flex-col items-start gap-3 rounded-3xl p-5 lg:p-6 transition-transform hover:-translate-y-1 h-40 lg:h-44 justify-between bg-slate-50/50">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <span className="material-symbols-outlined">light_mode</span>
            </div>
            <div>
                <span className="text-sm font-medium text-slate-500 mb-1 block">자외선 지수</span>
                <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">
                  {weather.current.uvi} 
                  <span className="text-base lg:text-lg font-medium ml-1 opacity-60 align-baseline">
                    ({weather.current.uvi <= 2 ? '낮음' : weather.current.uvi <= 5 ? '보통' : '높음'})
                  </span>
                </p>
            </div>
        </div>
        

        <div className="glass-panel flex flex-col items-start gap-3 rounded-3xl p-5 lg:p-6 transition-transform hover:-translate-y-1 h-40 lg:h-44 justify-between bg-indigo-50/50">
            <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                <span className="material-symbols-outlined">visibility</span>
            </div>
            <div>
                <span className="text-sm font-medium text-slate-500 mb-1 block">가시거리</span>
                <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">{(weather.current.visibility / 1000).toFixed(0)}km</p>
            </div>
        </div>
      </section>

      <section className="glass-panel w-full overflow-hidden rounded-3xl p-5">
        <h4 className="mb-4 text-lg font-bold text-[#111618]">7일간 예보</h4>
        {/* 모바일: 가로 스크롤 */}
        <div className="flex lg:hidden w-full gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x">
          {weather.daily?.slice(0, 7).map((day: any, index: number) => {
             const variant = getWeatherStyle(day.weather?.[0]?.main);
             return (
                <div key={day.dt} className="flex min-w-[80px] flex-col items-center gap-2 rounded-2xl bg-white/20 p-3 transition hover:bg-white/40 snap-start">
                  <span className={`text-sm font-medium whitespace-nowrap ${index === 0 ? 'text-slate-700' : 'text-slate-500'}`}>
                    {index === 0 ? '오늘' : new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(new Date(day.dt * 1000))}
                  </span>
                  <span className={`material-symbols-outlined text-3xl drop-shadow-sm ${variant.color}`}>
                    {variant.icon}
                  </span>
                  <span className="text-lg font-bold text-[#111618] tabular-nums">{Math.round(day.temp.max)}°</span>
                </div>
             );
          })}
        </div>
        
        {/* 데스크톱: 그리드 */}
        <div className="hidden lg:grid grid-cols-7 gap-3">
          {weather.daily?.slice(0, 7).map((day: any, index: number) => {
             const variant = getWeatherStyle(day.weather?.[0]?.main);
             return (
                <div key={day.dt} className="flex flex-col items-center gap-2 rounded-2xl bg-white/20 p-3 transition hover:bg-white/40">
                  <span className={`text-sm font-medium whitespace-nowrap ${index === 0 ? 'text-slate-700' : 'text-slate-500'}`}>
                    {index === 0 ? '오늘' : new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(new Date(day.dt * 1000))}
                  </span>
                  <span className={`material-symbols-outlined text-3xl drop-shadow-sm ${variant.color}`}>
                    {variant.icon}
                  </span>
                  <span className="text-lg font-bold text-[#111618] tabular-nums">{Math.round(day.temp.max)}°</span>
                </div>
             );
          })}
        </div>
      </section>
    </main>
  );
}

