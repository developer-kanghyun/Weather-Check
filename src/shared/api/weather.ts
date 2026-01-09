import { requestJson } from '@/shared/api/base';

const baseUrl = 'https://api.openweathermap.org';

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
    baseUrl,
    path,
    query: { ...query, appid: getApiKey() },
    signal,
  });
}

export type GeocodingResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
};

export type OneCallWeatherResponse = {
  lat: number;
  lon: number;
  timezone?: string;
  timezone_offset?: number;
  current?: {
    dt: number;
    temp: number;
    humidity?: number;
    wind_speed?: number;
    uvi?: number;
    visibility?: number;
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

const regions: Record<string, { lat: number; lon: number }> = {
  '강원특별자치도': { lat: 37.8854, lon: 127.7298 },
  '경기도': { lat: 37.2752, lon: 127.0095 },
  '충청북도': { lat: 36.6359, lon: 127.4913 },
  '충청남도': { lat: 36.6588, lon: 126.6730 },
  '전북특별자치도': { lat: 35.8205, lon: 127.1088 },
  '전라남도': { lat: 34.8161, lon: 126.4628 },
  '경상북도': { lat: 36.5760, lon: 128.5056 },
  '경상남도': { lat: 35.2383, lon: 128.6923 },
  '제주특별자치도': { lat: 33.4996, lon: 126.5312 },
  '세종특별자치시': { lat: 36.4800, lon: 127.2890 },
};

export async function geocodeDirect(params: {
  q: string;
  limit?: number;
  signal?: AbortSignal;
}) {
  const { q, limit = 5, signal } = params;
  return callWeatherApi<GeocodingResult[]>('/geo/1.0/direct', { q, limit }, signal);
}

export async function reverseGeocode(params: {
  lat: number;
  lon: number;
  limit?: number;
  signal?: AbortSignal;
}) {
  const { lat, lon, limit = 1, signal } = params;
  return callWeatherApi<GeocodingResult[]>('/geo/1.0/reverse', { lat, lon, limit }, signal);
}

export async function fetchOneCall(params: {
  lat: number;
  lon: number;
  units?: 'standard' | 'metric' | 'imperial';
  lang?: string;
  exclude?: string;
  signal?: AbortSignal;
}) {
  const { lat, lon, units = 'metric', lang = 'kr', exclude, signal } = params;
  return callWeatherApi<OneCallWeatherResponse>(
    '/data/3.0/onecall',
    { lat, lon, units, lang, exclude: exclude || '' },
    signal
  );
}

function buildCandidates(locationName: string): string[] {
  const tokens = locationName.split(/\s+/);
  const last = tokens[tokens.length - 1];
  const last2 = tokens.length >= 2 ? `${tokens[tokens.length - 2]} ${last}` : '';

  const candidates = [locationName, last2, last];

  const stripped = last.replace(/(군|읍|면|리|동)$/, '');
  if (stripped !== last && stripped.length >= 2) {
    candidates.push(stripped);
  }

  return Array.from(new Set(candidates))
    .filter(s => s && s.trim().length > 0)
    .map(s => `${s.trim()},KR`);
}

export async function getLocation(locationName: string): Promise<GeocodingResult[]> {
  const name = locationName.trim();
  if (!name) return [];

  const parts = name.split(/\s+/);
  const lastPart = parts[parts.length - 1];
  
  if (regions[lastPart]) {
    return [{ name: lastPart, ...regions[lastPart], country: 'KR' }];
  }

  for (const query of buildCandidates(name)) {
    try {
      const result = await geocodeDirect({ q: query, limit: 1 });
      if (result?.[0]) return result;
    } catch {
      continue;
    }
  }

  return [];
}
