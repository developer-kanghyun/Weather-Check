import { useParams } from 'react-router-dom';
import { createLocation } from '@/entities/location';
import { useLocationDisplay } from '@/features/location-display';

export const useDetailLocation = () => {
  const { locationId } = useParams<{ locationId: string }>();

  // URL 파라미터에서 위치 정보 추출
  const searchParams = new URLSearchParams(window.location.search);
  const locationName = searchParams.get('name');
  const fullAddress = searchParams.get('address');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // URL 정보를 기반으로 Location 객체 생성
  const location = createLocation({
    id: locationId || 'unknown',
    parts: (fullAddress || locationName || 'Unknown').split(/[\s-]+/).map(s => s.trim()).filter(Boolean),
    originalName: locationName || undefined,
    position: lat && lon ? { lat: parseFloat(lat), lon: parseFloat(lon) } : undefined
  });

  const display = useLocationDisplay(location);

  return {
    location,
    locationId,
    ...display
  };
}
