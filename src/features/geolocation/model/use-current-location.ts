import { useState, useEffect } from 'react';
import { type Location, createLocation, resolveLocationFromApi } from '@/entities/location';
import { reverseGeocode } from '@/shared/api/weather';
import { useCurrentPosition } from './use-current-position';
import { locationIndex } from '@/features/search-location/lib/location-index';

export function useCurrentLocation() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: currentPosition } = useCurrentPosition();

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      if (!currentPosition) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const geoResults = await reverseGeocode({ 
          lat: currentPosition.lat, 
          lon: currentPosition.lon 
        });
        
        if (isCancelled) return;

        let location: Location | null = null;
        
        if (geoResults && geoResults[0]) {
          const { name, state, local_names } = geoResults[0];
          const koName = local_names?.ko || name;
          
          location = resolveLocationFromApi({
            koName,
            state: state || undefined,
            locationIndex,
            position: { lat: currentPosition.lat, lon: currentPosition.lon }
          });
        }

        if (!location) {
          location = createLocation({
            id: 'current-location',
            parts: ['현재 위치'],
            position: { lat: currentPosition.lat, lon: currentPosition.lon },
          });
        }

        setSelectedLocation(location);
      } catch (err) {
        if (!isCancelled) {
          setError(err as Error);
          console.error('역지오코딩 실패:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }
    
    init();

    return () => {
      isCancelled = true;
    };
  }, [currentPosition]);

  return { selectedLocation, isLoading, error };
}
