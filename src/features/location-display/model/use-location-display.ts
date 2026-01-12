import { useFavorites } from '@/features/favorite-manage';
import { type Location } from '@/entities/location';

// 위치 객체와 전역 즐겨찾기 상태를 결합, 별명을 우선 반환
export const useLocationDisplay = (location?: Location | null) => {
  const { favorites } = useFavorites();

  if (!location) {
    return {
      title: '',
      address: '',
      showAddress: false,
      isCurrentLocation: false,
    };
  }

  const favorite = favorites.find(f => f.id === location.id);
  const isCurrentLocation = location.id === 'current-location';
  
  const title = isCurrentLocation 
    ? '나의 위치' 
    : (favorite?.name || location.displayLabel);
  
  const address = location.fullAddress;

  const showAddress = true;

  return {
    title,
    address,
    showAddress,
    isCurrentLocation,
  };
}
