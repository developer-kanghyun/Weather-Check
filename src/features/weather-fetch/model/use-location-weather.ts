import { useQuery } from '@tanstack/react-query';
import { geocodeDirect, fetchOneCall } from '@/shared/api/weather';
import { normalizeOneCall, type NormalizedWeather } from '@/entities/weather';
import type { Location } from '@/entities/location';

export function useLocationWeather(location: Location | null) {
  const geocodeQuery = useQuery({
    queryKey: ['geocode', location?.displayLabel],
    queryFn: async () => {
      if (!location) return null;
      // 이미 위치정보가 있다면 지오코딩 생략 (이름 변경 시에도 날씨 데이터 유지)
      if (location.position) return location.position;
      
      const results = await geocodeDirect({ q: `${location.displayLabel},KR`, limit: 1 });
      if (!results.length) return null;
      return { lat: results[0].lat, lon: results[0].lon };
    },
    enabled: location !== null,
    // 좌표는 변경이 거의 없으므로 무한 캐시 (불필요한 지오코딩 API 호출 방지)
    staleTime: Infinity,
  });

  const position = geocodeQuery.data;

  const weatherQuery = useQuery({
    queryKey: ['weather', position?.lat, position?.lon],
    queryFn: async (): Promise<NormalizedWeather | null> => {
      if (!position) return null;
      const raw = await fetchOneCall({ lat: position.lat, lon: position.lon });
      return normalizeOneCall(raw);
    },
    enabled: position !== null,
    staleTime: 1000 * 60 * 10,
  });

  const isLoading = geocodeQuery.isLoading || weatherQuery.isLoading;
  const isError = geocodeQuery.isError || weatherQuery.isError;
  const noData = !isLoading && !isError && !weatherQuery.data;

  return {
    weather: weatherQuery.data ?? null,
    position,
    isLoading,
    isError,
    noData,
  };
}
