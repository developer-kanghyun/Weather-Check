import type { Favorite } from '../model/types';

const STORAGE_KEY = 'weather-favorites';
const MAX_FAVORITES = 6;

export function getFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load favorites', e);
    return [];
  }
}

function saveFavorites(favorites: Favorite[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function addFavorite(favorite: Favorite): boolean {
  const current = getFavorites();
  
  // Location ID 기반 중복 체크 (같은 지역 다시 추가 방지)
  if (current.some((f) => f.id === favorite.id)) return false;

  if (current.length >= MAX_FAVORITES) {
    throw new Error(`즐겨찾기는 최대 ${MAX_FAVORITES}개까지 저장 가능합니다.`);
  }

  saveFavorites([...current, favorite]);
  return true;
}

export function removeFavorite(id: string): void {
  const current = getFavorites();
  saveFavorites(current.filter((f) => f.id !== id));
}

export function updateFavorite(id: string, updates: Partial<Omit<Favorite, 'id'>>): void {
  const current = getFavorites();
  const index = current.findIndex((f) => f.id === id);
  if (index === -1) return;

  current[index] = { ...current[index], ...updates };
  saveFavorites(current);
}
