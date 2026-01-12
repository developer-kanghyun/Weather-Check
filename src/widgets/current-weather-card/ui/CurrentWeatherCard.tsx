import { formatWeatherDescription, formatTemperature } from '@/entities/weather/lib/weather-format';
import { getWeatherStyle } from '@/entities/weather/lib/weather-styles';
import type { Weather } from '@/entities/weather';

interface CurrentWeatherCardProps {
  weather: Weather;
  address: string;
  showAddress: boolean;
}

export const CurrentWeatherCard = ({ weather, address, showAddress }: CurrentWeatherCardProps) => {
  const currentVariant = getWeatherStyle(weather.current.main);

  return (
    <section className="glass-panel relative overflow-hidden rounded-3xl p-6 lg:p-8">
      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              {showAddress && (
                <span className="text-lg font-medium text-slate-500 mb-1">
                  {address}
                </span>
              )}
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
  );
}
