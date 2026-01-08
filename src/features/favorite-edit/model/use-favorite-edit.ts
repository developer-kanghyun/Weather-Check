import { useState } from 'react';
import { useFavorites } from '@/features/favorite-manage';

interface UseFavoriteEditProps {
  favoriteId: string;
  initialName: string;
  onComplete?: () => void;
}

export function useFavoriteEdit({ favoriteId, initialName, onComplete }: UseFavoriteEditProps) {
  const [name, setName] = useState(initialName);
  const { renameFavorite } = useFavorites();

  const cancel = () => {
    setName(initialName);
    onComplete?.();
  };

  const save = () => {
    const result = renameFavorite(favoriteId, name);
    if (result.success) {
      onComplete?.();
    } else if (result.error) {
      alert(result.error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  return {
    name,
    setName,
    cancel,
    save,
    handleKeyDown,
  };
}
