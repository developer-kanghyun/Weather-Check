import { useQueries } from '@tanstack/react-query';
import { fetchOneCall } from '@/shared/api/weather';
import { normalizeOneCall, type NormalizedWeather } from '@/entities/weather';
import type { Favorite } from '@/entities/favorite';

export function useFavoritesWeather(favorites: Favorite[]) {
  const queries = useQueries({
    queries: favorites.map((fav) => ({
      queryKey: ['favorite-weather', fav.lat, fav.lon],
      queryFn: async (): Promise<NormalizedWeather | null> => {
        const raw = await fetchOneCall({ lat: fav.lat, lon: fav.lon });
        return normalizeOneCall(raw);
      },
      // 10분 캐시: 잦은 API 요청 방지
      staleTime: 1000 * 60 * 10,
    })),
  });

  // Location ID를 키로 날씨 데이터를 빠르게 조회하기 위한 Map
  const weatherByLocationId = new Map<string, NormalizedWeather | null>();
  favorites.forEach((fav, i) => {
    weatherByLocationId.set(fav.id, queries[i]?.data ?? null);
  });

  const isLoading = queries.some((q) => q.isLoading);

  return { weatherByLocationId, isLoading };
}
