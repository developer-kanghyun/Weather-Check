import { useNavigate } from 'react-router-dom';
import { FavoriteToggle } from '@/features/favorite-toggle';
import type { Location } from '@/entities/location';

interface DetailHeaderProps {
  title: string;
  location: Location;
  position: { lat: number; lon: number } | null;
}

export const DetailHeader = ({ title, location, position }: DetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 pb-2">
      <button 
        onClick={() => navigate('/')}
        className="flex size-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-md text-[#111618] flex-shrink-0"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      
      <div className="flex items-center gap-3 px-2 flex-1 min-w-0">
          <h1 className="text-xl lg:text-3xl font-extrabold text-[#111618] truncate">{title}</h1>
          <FavoriteToggle location={location} position={position} className="flex-shrink-0" />
      </div>
    </header>
  );
}
