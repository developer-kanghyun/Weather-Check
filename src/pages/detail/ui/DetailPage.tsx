import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useFavorites } from '@/features/favorite-manage/model/use-favorites';
import { useQuery } from '@tanstack/react-query';
import { fetchOneCall, type OneCallWeatherResponse } from '@/shared/api/weather';
import { weatherThemes, type WeatherStatus } from '@/shared/lib/weather-theme';

export function DetailPage() {
  const { locationId } = useParams<{ locationId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  // 즐겨찾기에 없으면 URL 정보 사용
  const favorite = favorites.find(f => f.id === locationId);
  const lat = favorite?.lat || Number(searchParams.get('lat'));
  const lon = favorite?.lon || Number(searchParams.get('lon'));
  const name = favorite?.name || searchParams.get('name') || '알 수 없는 지역';

  const { data: weather, isLoading, isError } = useQuery<OneCallWeatherResponse>({
    queryKey: ['oneCallWeather', lat, lon],
    queryFn: () => fetchOneCall({ lat, lon }),
    enabled: !!lat && !!lon,
    staleTime: 1000 * 60 * 10,
  });

  const weatherStatus: WeatherStatus = (weather?.current?.weather?.[0]?.main as WeatherStatus) || 'Clear';
  const theme = weatherThemes[weatherStatus] ?? weatherThemes.Clear;

  if (!lat || !lon) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="glass-panel p-8 rounded-2xl text-center">
          <h2 className="text-xl font-bold mb-4">지역 정보를 찾을 수 없습니다.</h2>
          <button onClick={() => navigate('/')} className="text-blue-500 hover:underline">홈</button>
        </div>
      </div>
    );
  }

  if (isLoading || isError || !weather) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">{isLoading ? '날씨 정보를 불러오는 중...' : '데이터 로드 실패'}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative overflow-hidden text-white">
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-700`} />

      <main className="relative z-10 w-full max-w-4xl mx-auto p-6 lg:p-12 overflow-y-auto">
        <header className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-4xl font-black drop-shadow-md">{name}</h1>
        </header>

        <section className="glass-panel rounded-[2.5rem] p-10 text-center mb-10 shadow-2xl backdrop-blur-md">
          <div className="text-8xl font-black mb-4">{Math.round(weather.current?.temp ?? 0)}°</div>
          <p className="text-2xl font-bold opacity-80 mb-6 capitalize">{weather.current?.weather?.[0]?.description ?? ''}</p>
          
          <div className="inline-flex gap-8 text-lg font-bold bg-white/10 px-8 py-3 rounded-full">
            <span>최고 {Math.round(weather.daily?.[0]?.temp.max ?? 0)}°</span>
            <span className="w-px h-6 bg-white/20" />
            <span>최저 {Math.round(weather.daily?.[0]?.temp.min ?? 0)}°</span>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-8 shadow-xl backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">schedule</span>
            시간대별 예보
          </h2>
          <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
            {weather.hourly?.slice(0, 24).map((hour) => (
              <div key={hour.dt} className="flex flex-col items-center min-w-[70px] py-4 rounded-2xl hover:bg-white/10 transition-colors">
                <span className="text-xs font-bold opacity-60 mb-2">
                  {new Date(hour.dt * 1000).getHours()}시
                </span>
                <span className="material-symbols-outlined text-3xl mb-2 text-blue-400">
                  {hour.weather?.[0]?.main === 'Clear' ? 'wb_sunny' : 'cloud'}
                </span>
                <span className="text-lg font-bold">{Math.round(hour.temp)}°</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
