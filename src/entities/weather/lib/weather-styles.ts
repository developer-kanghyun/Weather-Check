// 날씨 상태별 아이콘 및 스타일 정의
export interface WeatherStyle {
  icon: string;
  color: string;
  glow: string;
  bg: string;
}

const weatherStyleMap: Record<string, WeatherStyle> = {
  Clear: { 
    icon: 'wb_sunny', 
    color: 'text-yellow-500', 
    glow: 'bg-yellow-300',
    bg: 'bg-yellow-50'
  },
  Rain: { 
    icon: 'rainy', 
    color: 'text-blue-500', 
    glow: 'bg-blue-400',
    bg: 'bg-blue-50'
  },
  Drizzle: { 
    icon: 'rainy', 
    color: 'text-blue-500', 
    glow: 'bg-blue-400',
    bg: 'bg-blue-50'
  },
  Thunderstorm: { 
    icon: 'rainy', 
    color: 'text-blue-500', 
    glow: 'bg-blue-400',
    bg: 'bg-blue-50'
  },
  Snow: { 
    icon: 'weather_snowy', 
    color: 'text-indigo-600', 
    glow: 'bg-blue-100',
    bg: 'bg-indigo-100'
  },
  Clouds: { 
    icon: 'cloud', 
    color: 'text-slate-400', 
    glow: 'bg-slate-300',
    bg: 'bg-slate-100'
  },
  Default: { 
    icon: 'partly_cloudy_day', 
    color: 'text-slate-400', 
    glow: 'bg-slate-300',
    bg: 'bg-slate-50'
  },
};

export function getWeatherStyle(condition: string): WeatherStyle {
  return weatherStyleMap[condition] || weatherStyleMap.Default;
}
