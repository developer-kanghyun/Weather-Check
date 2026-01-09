import { useMemo, useState } from 'react';
import type { Location } from '@/entities/location';
import { locationIndex } from '../lib/location-index';

const MAX_RESULTS = 20;

function calculateScore(loc: Location, normalizedQuery: string, searchKeywords: string[]): number {
  const partsLower = loc.parts.map(p => p.toLowerCase());
  const matchCount = searchKeywords.filter(k => partsLower.some(p => p.includes(k))).length;
  
  const compactMatch = loc.compactName.includes(normalizedQuery);
  const keywordMatch = matchCount === searchKeywords.length;

  if (!compactMatch && !keywordMatch) return -1;

  let score = matchCount * 10;

  // 시작 부분 일치 점수
  if (loc.compactName.startsWith(normalizedQuery)) score += 100;

  // 순서 일치 점수
  let lastFoundIndex = -1;
  let isSequential = true;
  for (const keyword of searchKeywords) {
    const foundIndex = partsLower.findIndex((p, idx) => idx > lastFoundIndex && p.includes(keyword));
    if (foundIndex !== -1) lastFoundIndex = foundIndex;
    else {
      isSequential = false;
      break;
    }
  }
  if (isSequential) score += 80;

  // 행정구역 깊이 가중치 (짧은 검색어는 시/도 우선, 긴 검색어는 동/면 우선)
  if (searchKeywords.length <= 2) {
    score += (5 - loc.depth) * 20;
  } else {
    score += loc.depth * 20;
  }

  return score;
}

function searchLocations(query: string): Location[] {
  const rawQuery = query.trim().toLowerCase();
  if (!rawQuery) return [];

  const normalizedQuery = rawQuery.replace(/[-\s]/g, '');
  const searchKeywords = rawQuery.split(/\s+/).filter(Boolean);

  return locationIndex
    .map((loc) => ({ loc, score: calculateScore(loc, normalizedQuery, searchKeywords) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || a.loc.depth - b.loc.depth)
    .slice(0, MAX_RESULTS)
    .map((item) => item.loc);
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
