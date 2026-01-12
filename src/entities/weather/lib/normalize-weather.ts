import type { OneCallWeatherResponse } from '@/shared/api/weather';
import type { Weather } from '../model/types';

const HOURLY_COUNT = 24;

export const normalizeOneCall = (raw: OneCallWeatherResponse): Weather | null => {
  const { current, daily, hourly } = raw;

  if (!current || !daily?.[0]) {
    return null;
  }

  const currentWeather = current.weather?.[0];
  const todayDaily = daily[0];

  return {
    current: {
      temp: Math.round(current.temp),
      feels_like: Math.round(current.feels_like ?? current.temp),
      description: currentWeather?.description ?? '',
      icon: currentWeather?.icon ?? '01d',
      main: currentWeather?.main ?? 'Clear',
      humidity: current.humidity ?? 0,
      wind_speed: current.wind_speed ?? 0,
      uvi: current.uvi ?? 0,
      visibility: current.visibility ?? 0,
    },
    today: {
      tempMin: Math.round(todayDaily.temp.min),
      tempMax: Math.round(todayDaily.temp.max),
    },
    hourly: (hourly ?? []).slice(0, HOURLY_COUNT).map((h) => ({
      dt: h.dt,
      temp: Math.round(h.temp),
      weather: h.weather ?? [],
      pop: h.pop ?? 0,
    })),
    daily: (daily ?? []).map((d) => ({
      dt: d.dt,
      temp: {
        min: Math.round(d.temp.min),
        max: Math.round(d.temp.max),
        day: Math.round(d.temp.day ?? 0),
        night: Math.round(d.temp.night ?? 0),
        eve: Math.round(d.temp.eve ?? 0),
        morn: Math.round(d.temp.morn ?? 0),
      },
      weather: d.weather ?? [],
      pop: d.pop ?? 0,
    })),
  };
}
