import { getWeatherStyle } from '@/entities/weather/lib/weather-styles';
import type { Hourly } from '@/entities/weather';

interface HourlyForecastProps {
  hourly: Hourly[];
}

export const HourlyForecast = ({ hourly }: HourlyForecastProps) => {
  return (
    <section className="glass-panel w-full overflow-hidden rounded-3xl p-5">
      <h4 className="mb-4 text-lg font-bold text-[#111618]">시간별 예보</h4>
      <div className="flex w-full gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
        {hourly.slice(0, 24).map((hour, index) => {
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
                <span className={`text-sm md:text-sm font-medium whitespace-nowrap ${index === 0 ? 'text-slate-700' : 'text-slate-500'}`}>
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
  );
}
