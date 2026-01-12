import { useQuery } from '@tanstack/react-query';

interface Position {
  lat: number;
  lon: number;
}

const getCurrentPosition = (): Promise<Position> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
}

export const useCurrentPosition = () => {
  return useQuery({
    queryKey: ['currentPosition'],
    queryFn: getCurrentPosition,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
