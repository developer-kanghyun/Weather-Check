export type WeatherStatus = 'Clear' | 'Clouds' | 'Rain' | 'Snow' | 'Atmosphere';

export interface WeatherTheme {
  backgroundImage: string;
  gradientOverlay: string;
}

export const weatherThemes: Record<WeatherStatus, WeatherTheme> = {
  Clear: {
    backgroundImage: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=2000&auto=format&fit=crop',
    gradientOverlay: 'from-sky-100/30 via-white/20 to-transparent',
  },
  Clouds: {
    backgroundImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop',
    gradientOverlay: 'from-slate-200/40 via-white/30 to-slate-300/20',
  },
  Rain: {
    backgroundImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop',
    gradientOverlay: 'from-slate-200/70 via-slate-300/50 to-blue-200/30',
  },
  Snow: {
    backgroundImage: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2000&auto=format&fit=crop',
    gradientOverlay: 'from-white/40 via-blue-50/30 to-slate-200/20',
  },
  Atmosphere: {
    backgroundImage: 'https://images.unsplash.com/photo-1438818454955-442f833a697c?q=80&w=2000&auto=format&fit=crop',
    gradientOverlay: 'from-gray-200/50 via-white/30 to-gray-100/20',
  },
};

const weatherDescriptionMap: Record<string, string> = {
  '튼구름': '구름 많음',
  '온흐림': '흐림',
  '실비': '이슬비',
  '박무': '안개',
  '연무': '안개',
};

export function localizeWeather(description: string): string {
  if (!description) return '';
  return weatherDescriptionMap[description] || description;
}
