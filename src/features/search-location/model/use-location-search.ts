import { useMemo, useState } from 'react';
import type { Location } from '@/entities/location';
import { locationIndex } from '../lib/location-index';

const MAX_RESULTS = 20;

function rankMatch(location: Location, query: string): number {
  const q = query.toLowerCase();
  for (const part of location.parts) {
    const p = part.toLowerCase();
    if (p === q) return 0;
    if (p.startsWith(q)) return 1;
    if (p.includes(q)) return 2;
  }
  return 3;
}

function searchLocations(query: string): Location[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const matched = locationIndex
    .map((loc) => ({ loc, rank: rankMatch(loc, trimmed) }))
    .filter((item) => item.rank < 3)
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.loc.depth - b.loc.depth;
    })
    .slice(0, MAX_RESULTS)
    .map((item) => item.loc);

  return matched;
}

export function useLocationSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchLocations(query), [query]);

  return {
    query,
    setQuery,
    results,
  };
}
