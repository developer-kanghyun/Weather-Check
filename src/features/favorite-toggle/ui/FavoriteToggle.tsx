import { useFavorites } from '@/features/favorite-manage';
import type { Location } from '@/entities/location';

interface FavoriteToggleProps {
  location: Location;
  position: { lat: number; lon: number } | null;
  className?: string;
}

export function FavoriteToggle({ location, position, className = '' }: FavoriteToggleProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isActive = isFavorite(location.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!position) return;
    
    const result = toggleFavorite(location, position);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!position}
      className={`p-2 rounded-full transition-all ${
        isActive 
          ? 'text-yellow-500 bg-yellow-500/10' 
          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
      } ${!position ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
      title={isActive ? '즐겨찾기 삭제' : '즐겨찾기 추가'}
    >
      <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
        {isActive ? 'star' : 'star_border'}
      </span>
    </button>
  );
}
