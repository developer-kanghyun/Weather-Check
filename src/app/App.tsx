import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SearchBox } from '@/features/search-location'
import { useWeatherByLocation } from '@/features/weather-fetch'
import { WEATHER_THEMES, type WeatherStatus } from '@/shared/lib/weather-theme'
import type { Location } from '@/entities/location'

function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { weather, isLoading, isError, noData } = useWeatherByLocation(selectedLocation);

  const weatherStatus: WeatherStatus = (weather?.current.main as WeatherStatus) || 'Clear';
  const theme = WEATHER_THEMES[weatherStatus] ?? WEATHER_THEMES.Clear;

  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-fixed bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
      />
      <div className={`fixed inset-0 bg-gradient-to-br ${theme.gradientOverlay} pointer-events-none z-0 transition-all duration-700`} />

      <div className="relative z-10 min-h-screen">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 lg:px-8">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-[#111618] dark:text-white">SkyWeather</h1>
            <SearchBox onSelect={setSelectedLocation} />
          </header>

          <main className="flex flex-col items-center gap-8 mt-12">
            {!selectedLocation && (
              <p className="text-lg text-slate-600 dark:text-slate-300">
                지역을 검색해 주세요.
              </p>
            )}

            {isLoading && (
              <p className="text-lg text-slate-500 animate-pulse">날씨 정보를 불러오는 중...</p>
            )}

            {isError && (
              <p className="text-lg text-red-500">날씨 정보를 불러오는 데 실패했습니다.</p>
            )}

            {noData && selectedLocation && (
              <p className="text-lg text-slate-600 dark:text-slate-300">
                해당 장소의 정보가 제공되지 않습니다.
              </p>
            )}

            {weather && selectedLocation && (
              <div className="glass-panel rounded-3xl p-8 w-full max-w-lg text-center">
                <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">
                  {selectedLocation.displayLabel}
                </p>
                <h2 className="text-7xl font-black text-[#111618] dark:text-white mb-2">
                  {weather.current.temp}°
                </h2>
                <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 capitalize">
                  {weather.current.description}
                </p>
                <div className="flex justify-center gap-6 text-sm text-slate-500">
                  <span>최고: {weather.today.tempMax}°</span>
                  <span>최저: {weather.today.tempMin}°</span>
                </div>
              </div>
            )}

            {weather && weather.hourly.length > 0 && (
              <div className="glass-panel rounded-3xl p-6 w-full max-w-2xl overflow-hidden">
                <h3 className="text-lg font-bold text-[#111618] dark:text-white mb-4">시간별 예보</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {weather.hourly.slice(0, 12).map((h, i) => (
                    <div key={h.dt} className="flex flex-col items-center min-w-[60px] gap-2">
                      <span className="text-xs text-slate-500">
                        {i === 0 ? '지금' : new Date(h.dt * 1000).getHours() + '시'}
                      </span>
                      <img
                        src={`https://openweathermap.org/img/wn/${h.icon}@2x.png`}
                        alt={h.main}
                        className="w-10 h-10"
                      />
                      <span className="text-sm font-bold text-[#111618] dark:text-white">{h.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:favoriteId" element={<div>상세 페이지 준비 중</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
