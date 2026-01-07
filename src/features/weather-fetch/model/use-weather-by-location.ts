import { useQuery } from '@tanstack/react-query';
import { geocodeDirect, fetchOneCall } from '@/shared/api/weather';
import { normalizeOneCall, type NormalizedWeather, type Coords } from '@/entities/weather';
import type { Location } from '@/entities/location';

export function useWeatherByLocation(location: Location | null) {
  const geocodeQuery = useQuery({
    queryKey: ['geocode', location?.displayLabel],
    queryFn: async () => {
      if (!location) return null;
      const results = await geocodeDirect({ q: `${location.displayLabel},KR`, limit: 1 });
      if (!results.length) return null;
      return { lat: results[0].lat, lon: results[0].lon } as Coords;
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 60,
  });

  const coords = geocodeQuery.data;

  const weatherQuery = useQuery({
    queryKey: ['weather', coords?.lat, coords?.lon],
    queryFn: async (): Promise<NormalizedWeather | null> => {
      if (!coords) return null;
      const raw = await fetchOneCall({ lat: coords.lat, lon: coords.lon });
      return normalizeOneCall(raw);
    },
    enabled: !!coords,
    staleTime: 1000 * 60 * 10,
  });

  const isLoading = geocodeQuery.isLoading || weatherQuery.isLoading;
  const isError = geocodeQuery.isError || weatherQuery.isError;
  const noData = !isLoading && !isError && !weatherQuery.data;

  return {
    weather: weatherQuery.data ?? null,
    coords,
    isLoading,
    isError,
    noData,
  };
}
