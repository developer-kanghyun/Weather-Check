interface WeatherMetricsGridProps {
  current: {
    humidity: number;
    wind_speed: number;
    uvi: number;
    visibility: number;
  };
}

export const WeatherMetricsGrid = ({ current }: WeatherMetricsGridProps) => {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <div className="glass-panel flex flex-col items-start gap-3 rounded-3xl p-5 lg:p-6 transition-transform hover:-translate-y-1 h-40 lg:h-44 justify-between bg-blue-50/50">
        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
          <span className="material-symbols-outlined">water_drop</span>
        </div>
        <div>
          <span className="text-sm font-medium text-slate-500 mb-1 block">습도</span>
          <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">{current.humidity}%</p>
        </div>
      </div>

      <div className="glass-panel flex flex-col items-start gap-3 rounded-3xl p-5 lg:p-6 transition-transform hover:-translate-y-1 h-40 lg:h-44 justify-between bg-teal-50/50">
        <div className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-500">
          <span className="material-symbols-outlined">air</span>
        </div>
        <div>
          <span className="text-sm font-medium text-slate-500 mb-1 block">바람</span>
          <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">{Math.round(current.wind_speed)}m/s</p>
        </div>
      </div>

      <div className="glass-panel flex flex-col items-start gap-3 rounded-3xl p-5 lg:p-6 transition-transform hover:-translate-y-1 h-40 lg:h-44 justify-between bg-slate-50/50">
        <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <span className="material-symbols-outlined">light_mode</span>
        </div>
        <div>
          <span className="text-sm font-medium text-slate-500 mb-1 block">자외선 지수</span>
          <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">
            {current.uvi}
            <span className="text-base lg:text-lg font-medium ml-1 opacity-60 align-baseline">
              ({current.uvi <= 2 ? '낮음' : current.uvi <= 5 ? '보통' : '높음'})
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
          <p className="text-2xl lg:text-3xl font-bold text-[#111618] tabular-nums">{(current.visibility / 1000).toFixed(0)}km</p>
        </div>
      </div>
    </section>
  );
}
