import { requestJson } from '@/shared/api/base';

const BASE_URL = 'https://api.openweathermap.org';

function getApiKey() {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!key) throw new Error('환경변수 VITE_OPENWEATHER_API_KEY가 설정되지 않았습니다.');
  return key;
}

function callWeatherApi<T>(
  path: string,
  query: Record<string, string | number | boolean>,
  signal?: AbortSignal
) {
  return requestJson<T>({
    baseUrl: BASE_URL,
    path,
    query: { ...query, appid: getApiKey() },
    signal,
  });
}

export type GeocodingDirectItem = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export async function geocodeDirect(params: {
  q: string;
  limit?: number;
  signal?: AbortSignal;
}) {
  const { q, limit = 5, signal } = params;
  return callWeatherApi<GeocodingDirectItem[]>('/geo/1.0/direct', { q, limit }, signal);
}

export type OneCallWeatherResponse = {
  lat: number;
  lon: number;
  timezone?: string;
  timezone_offset?: number;
  current?: {
    dt: number;
    temp: number;
    weather?: Array<{ main: string; description: string; icon: string }>;
  };
  hourly?: Array<{
    dt: number;
    temp: number;
    weather?: Array<{ main: string; description: string; icon: string }>;
  }>;
  daily?: Array<{
    dt: number;
    temp: { min: number; max: number; day?: number };
    weather?: Array<{ main: string; description: string; icon: string }>;
  }>;
};

export async function fetchOneCall(params: {
  lat: number;
  lon: number;
  units?: 'standard' | 'metric' | 'imperial';
  lang?: string;
  signal?: AbortSignal;
}) {
  const { lat, lon, units = 'metric', lang = 'ko', signal } = params;
  return callWeatherApi<OneCallWeatherResponse>('/data/3.0/onecall', { lat, lon, units, lang }, signal);
}
