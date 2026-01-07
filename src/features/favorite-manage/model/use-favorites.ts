import { useState, useCallback } from 'react';
import { type Favorite, getFavorites, addFavorite, removeFavorite, updateFavorite } from '@/entities/favorite';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(() => getFavorites());

  const refresh = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  const add = useCallback((favorite: Favorite) => {
    try {
      addFavorite(favorite);
      refresh();
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : '저장 실패' };
    }
  }, [refresh]);

  const remove = useCallback((id: string) => {
    removeFavorite(id);
    refresh();
  }, [refresh]);

  const update = useCallback((id: string, updates: Partial<Favorite>) => {
    updateFavorite(id, updates);
    refresh();
  }, [refresh]);

  return {
    favorites,
    add,
    remove,
    update,
  };
}
