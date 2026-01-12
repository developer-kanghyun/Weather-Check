import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { type Favorite, getFavorites, addFavorite, removeFavorite, updateFavorite } from '@/entities/favorite';
import type { Location } from '@/entities/location';

interface FavoritesContextValue {
  favorites: Favorite[];
  toggleFavorite: (location: Location, position: { lat: number; lon: number }) => { success: boolean; action?: 'added' | 'removed'; error?: string };
  renameFavorite: (id: string, newName: string) => { success: boolean; error?: string };
  remove: (id: string) => void;
  isFavorite: (id: string) => boolean;
  canAddMore: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => getFavorites());


  const isFavorite = useCallback((id: string) => {
    return favorites.some((f) => f.id === id);
  }, [favorites]);

  const remove = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    removeFavorite(id);
    toast.success('즐겨찾기에서 제거되었습니다.');
  }, []);

  // 이름 변경 시에도 날씨 조회가 가능하도록 좌표 저장
  const toggleFavorite = useCallback((location: Location, position: { lat: number; lon: number }) => {
    if (isFavorite(location.id)) {
      remove(location.id);
      return { success: true, action: 'removed' as const };
    }

    if (favorites.length >= 6) {
      toast.error('즐겨찾기는 최대 6개까지 가능합니다.');
      return { success: false, error: '즐겨찾기는 최대 6개까지 가능합니다.' };
    }

    const newFavorite: Favorite = {
      id: location.id,
      name: location.displayLabel,
      originalName: location.originalName || location.displayLabel,
      lat: position.lat,
      lon: position.lon,
    };

    setFavorites(prev => [...prev, newFavorite]);
    addFavorite(newFavorite);
    toast.success(`즐겨찾기에 추가되었습니다.`);
    return { success: true, action: 'added' as const };
  }, [favorites.length, isFavorite, remove]);

  const renameFavorite = useCallback((id: string, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName) return { success: false, error: '이름을 입력해주세요.' };
    
    setFavorites(prev => prev.map(f => 
      f.id === id ? { ...f, name: trimmedName } : f
    ));
    updateFavorite(id, { name: trimmedName });
    toast.success('별명이 변경되었습니다.');
    return { success: true };
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      renameFavorite,
      remove,
      isFavorite,
      canAddMore: favorites.length < 6,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites는 FavoritesProvider 내부에서 사용 가능.');
  }
  return context;
}
