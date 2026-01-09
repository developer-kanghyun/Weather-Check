import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOneCall, getLocation, type OneCallWeatherResponse } from '@/shared/api/weather';
import { type WeatherStatus } from '@/shared/lib/weather-theme';
import { formatWeatherDescription, formatTemperature } from '@/entities/weather/lib/weather-format';
import { useTheme } from '@/shared/context/ThemeContext';
import { createLocation } from '@/entities/location';
import { FavoriteToggle } from '@/features/favorite-toggle';

export function DetailPage() {
  const { locationId } = useParams<{ locationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setWeatherStatus } = useTheme();

  const paramLat = searchParams.get('lat');
  const paramLon = searchParams.get('lon');
  const locationName = searchParams.get('name') || '';

  const needsGeocoding = (!paramLat || !paramLon) && !!locationName;
  
  const { 
    data: geoData = [], 
    isLoading: isGeoLoading,
    isError: isGeoError
  } = useQuery({
    queryKey: ['geocode', locationName],
    queryFn: () => getLocation(locationName),
    enabled: needsGeocoding,
    staleTime: Infinity,
  });

  const lat = Number(paramLat) || geoData[0]?.lat;
  const lon = Number(paramLon) || geoData[0]?.lon;

  const { 
    data: weather, 
    isLoading: isWeatherLoading, 
    isError: isWeatherError 
  } = useQuery<OneCallWeatherResponse>({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchOneCall({ lat: lat!, lon: lon! }),
    enabled: !!lat && !!lon,
  });

  useEffect(() => {
    const status: WeatherStatus = (weather?.current?.weather?.[0]?.main as WeatherStatus) || 'Clear';
    setWeatherStatus(status);
  }, [weather, setWeatherStatus]);

  const currentLocation = useMemo(() => {
    if (!locationId || !lat || !lon) return null;
    return createLocation({
      id: locationId,
      parts: [locationName],
      originalName: locationName,
      position: { lat, lon }
    });
  }, [locationId, locationName, lat, lon]);

  if (isGeoLoading || isWeatherLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-5xl opacity-50">cloud_sync</span>
            <p className="font-medium opacity-70">날씨 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (needsGeocoding && (isGeoError || geoData.length === 0)) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-2xl text-center max-w-sm">
          <span className="material-symbols-outlined text-4xl mb-3 text-red-500">error</span>
          <h2 className="text-xl font-bold mb-2">위치 정보 오류</h2>
          <p className="opacity-60 mb-6 font-medium text-sm">해당 장소의 정보가 제공되지 않습니다.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-black/10 hover:bg-black/20 font-bold transition">홈으로 가기</button>
        </div>
      </div>
    );
  }

  if (isWeatherError || !weather) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-2xl text-center max-w-sm">
          <h2 className="text-xl font-bold mb-2">날씨 조회 실패</h2>
          <p className="opacity-60 mb-6 font-medium">해당 장소의 정보가 제공되지 않습니다.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-black/10 hover:bg-black/20 font-bold transition">홈으로 가기</button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
      <header className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black drop-shadow-md text-[#111618] dark:text-white">{locationName}</h1>
          {currentLocation && (
             <FavoriteToggle 
               location={currentLocation} 
               position={{ lat, lon }}
               className="transform hover:scale-110 transition-transform"
             />
          )}
        </div>
      </header>

      <section className="glass-panel rounded-[2.5rem] p-10 text-center mb-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="relative z-10">
            <div className="text-8xl font-black mb-4 text-[#111618] dark:text-white tracking-tighter">
              {formatTemperature(weather.current?.temp)}
            </div>
            <p className="text-2xl font-bold opacity-80 mb-6 capitalize text-[#111618] dark:text-white">
              {formatWeatherDescription(weather.current?.weather?.[0]?.main, weather.current?.weather?.[0]?.description)}
            </p>
            
            <div className="inline-flex gap-8 text-lg font-bold bg-white/10 px-8 py-3 rounded-full text-[#111618] dark:text-white">
            <span>최고 {formatTemperature(weather.daily?.[0]?.temp.max)}</span>
            <span className="w-px h-6 bg-white/20" />
            <span>최저 {formatTemperature(weather.daily?.[0]?.temp.min)}</span>
            </div>
        </div>
        <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-[250px] opacity-5 pointer-events-none">
            {weather.current?.weather?.[0]?.main === 'Clear' ? 'wb_sunny' : 'cloud'}
        </span>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-40">
            <span className="material-symbols-outlined text-3xl mb-2 text-blue-500">water_drop</span>
            <div>
                <p className="text-sm opacity-60 font-bold mb-1">습도</p>
                <p className="text-2xl font-bold">{weather.current?.humidity}%</p>
            </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-40">
            <span className="material-symbols-outlined text-3xl mb-2 text-teal-500">air</span>
            <div>
                <p className="text-sm opacity-60 font-bold mb-1">풍속</p>
                <p className="text-2xl font-bold">{weather.current?.wind_speed}m/s</p>
            </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-40">
            <span className="material-symbols-outlined text-3xl mb-2 text-orange-500">wb_sunny</span>
            <div>
                <p className="text-sm opacity-60 font-bold mb-1">자외선 지수</p>
                <p className="text-2xl font-bold">{weather.current?.uvi}</p>
            </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-40">
            <span className="material-symbols-outlined text-3xl mb-2 text-purple-500">visibility</span>
            <div>
                <p className="text-sm opacity-60 font-bold mb-1">가시거리</p>
                <p className="text-2xl font-bold">{(weather.current?.visibility ?? 0) / 1000}km</p>
            </div>
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-8 shadow-xl backdrop-blur-sm mb-10">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#111618] dark:text-white">
          <span className="material-symbols-outlined">schedule</span>
          시간대별 예보
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
          {weather.hourly?.slice(0, 24).map((hour: any) => (
            <div key={hour.dt} className="flex flex-col items-center min-w-[70px] py-4 rounded-3xl hover:bg-white/10 transition-colors">
              <span className="text-xs font-bold opacity-60 mb-2 text-[#111618] dark:text-white">
                {new Date(hour.dt * 1000).getHours()}시
              </span>
              <span className="material-symbols-outlined text-3xl mb-2 text-blue-500 drop-shadow-sm">
                {hour.weather?.[0]?.main === 'Clear' ? 'wb_sunny' : 'cloud'}
              </span>
              <span className="text-lg font-bold text-[#111618] dark:text-white">{Math.round(hour.temp)}°</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-8 shadow-xl backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#111618] dark:text-white">
          <span className="material-symbols-outlined">calendar_month</span>
          7일간 예보
        </h2>
        <div className="flex flex-col gap-4">
          {weather.daily?.slice(1).map((day: any) => (
            <div key={day.dt} className="flex items-center justify-between py-3 border-b border-black/5 dark:border-white/10 last:border-0">
              <span className="w-20 font-bold opacity-80 text-[#111618] dark:text-white">
                {new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(new Date(day.dt * 1000))}
              </span>
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-2xl text-blue-500">
                    {day.weather?.[0]?.main === 'Clear' ? 'wb_sunny' : 'cloud'}
                 </span>
                 <span className="text-sm opacity-60 hidden sm:block">{day.weather?.[0]?.description}</span>
              </div>
              <div className="flex gap-4 w-32 justify-end font-bold text-[#111618] dark:text-white">
                <span className="opacity-60">{Math.round(day.temp.min)}°</span>
                <div className="w-16 h-1.5 bg-black/5 dark:bg-white/10 rounded-full mt-2 relative overflow-hidden">
                    <div 
                        className="absolute inset-y-0 bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                        style={{
                            left: '20%', 
                            right: '20%' 
                        }} 
                    />
                </div>
                <span>{Math.round(day.temp.max)}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
