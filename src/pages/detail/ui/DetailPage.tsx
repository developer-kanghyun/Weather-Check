import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationWeather } from '@/features/weather-fetch';
import { useTheme } from '@/shared/context/ThemeContext';
import type { WeatherStatus } from '@/shared/lib/weather-theme';
import { DetailHeader } from '@/widgets/detail-header';
import { CurrentWeatherCard } from '@/widgets/current-weather-card';
import { HourlyForecast } from '@/widgets/hourly-forecast';
import { DailyForecast } from '@/widgets/daily-forecast';
import { WeatherMetricsGrid } from '@/widgets/weather-metrics';
import { useDetailLocation } from '../model/use-detail-location';

export const DetailPage = () => {
  const navigate = useNavigate();
  const { setWeatherStatus } = useTheme();
  
  const { location, title, address, showAddress } = useDetailLocation();

  const { weather, position, isLoading, isError } = useLocationWeather(location);

  // 테마 상태 변경 부수 효과
  useEffect(() => {
    if (weather?.current?.main) {
        setWeatherStatus(weather.current.main as WeatherStatus);
    }
  }, [weather, setWeatherStatus]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <span className="material-symbols-outlined text-6xl text-white/50">cloud</span>
            <p className="text-white/70 font-bold">날씨 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !weather) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="glass-panel p-8 rounded-3xl text-center">
            <p className="text-red-500 font-bold text-lg mb-2">해당 장소의 정보가 제공되지 않습니다.</p>
            <button onClick={() => navigate('/')} className="text-sm underline opacity-60 hover:opacity-100">홈으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 lg:p-6 overflow-y-auto animate-slide-up flex flex-col gap-4 max-w-full">
      {/* 헤더 섹션 (뒤로가기, 제목, 즐겨찾기) */}
      <DetailHeader 
        title={title} 
        location={location} 
        position={position ?? null} 
      />

      {/* 현재 날씨 카드 (기온, 주소, 아이콘) */}
      <CurrentWeatherCard 
        weather={weather} 
        address={address} 
        showAddress={showAddress} 
      />

      {/* 시간별 예보 섹션 */}
      <HourlyForecast hourly={weather.hourly} />

      {/* 상세 날씨 지표 그리드 (습도, 풍속 등) */}
      <WeatherMetricsGrid current={weather.current} />

      {/* 7일간 예보 섹션 */}
      <DailyForecast daily={weather.daily} />
    </main>
  );
}
