import { getWeatherStyle } from '@/entities/weather/lib/weather-styles';
import type { Daily } from '@/entities/weather';

interface DailyForecastProps {
  daily: Daily[];
}

export const DailyForecast = ({ daily }: DailyForecastProps) => {
  return (
    <section className="glass-panel w-full overflow-hidden rounded-3xl p-5">
      <h4 className="mb-4 text-lg font-bold text-[#111618]">7일간 예보</h4>
      {/* 모바일: 가로 스크롤 */}
      <div className="flex lg:hidden w-full gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x">
        {daily.slice(0, 7).map((day, index) => {
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
        {daily.slice(0, 7).map((day, index) => {
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
  );
}
