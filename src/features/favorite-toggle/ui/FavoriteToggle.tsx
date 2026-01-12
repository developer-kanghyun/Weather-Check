import { useFavorites } from '@/features/favorite-manage';
import type { Location } from '@/entities/location';

interface FavoriteToggleProps {
  location: Location;
  position: { lat: number; lon: number } | null;
  className?: string;
}

export const FavoriteToggle = ({ location, position, className = '' }: FavoriteToggleProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isActive = isFavorite(location.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!position) return;
    
    toggleFavorite(location, position);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!position}
      className={`size-10 flex items-center justify-center rounded-full transition-all ${
        isActive 
          ? 'text-pink-500 hover:bg-pink-800/20 hover:shadow-sm hover:backdrop-blur-sm' 
          : 'text-[#101618] hover:bg-black/5'
      } ${!position ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
      title={isActive ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
    >
      <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
        {isActive ? 'favorite' : 'favorite'}
      </span>
    </button>
  );
}
