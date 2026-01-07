import type { OneCallWeatherResponse } from '@/shared/api/weather';
import type { NormalizedWeather } from '../model/types';

const HOURLY_COUNT = 24;

export function normalizeOneCall(raw: OneCallWeatherResponse): NormalizedWeather | null {
  const { current, daily, hourly } = raw;

  if (!current || !daily?.[0]) {
    return null;
  }

  const currentWeather = current.weather?.[0];
  const todayDaily = daily[0];

  return {
    current: {
      temp: Math.round(current.temp),
      description: currentWeather?.description ?? '',
      icon: currentWeather?.icon ?? '01d',
      main: currentWeather?.main ?? 'Clear',
    },
    today: {
      tempMin: Math.round(todayDaily.temp.min),
      tempMax: Math.round(todayDaily.temp.max),
    },
    hourly: (hourly ?? []).slice(0, HOURLY_COUNT).map((h) => ({
      dt: h.dt,
      temp: Math.round(h.temp),
      icon: h.weather?.[0]?.icon ?? '01d',
      main: h.weather?.[0]?.main ?? 'Clear',
    })),
  };
}
