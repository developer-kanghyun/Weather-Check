import type { Location } from '../model/types';
import { createLocation } from './create-location';

interface ResolveParams {
  koName: string;
  state?: string;
  locationIndex: Location[];
  position?: { lat: number; lon: number };
}

// API 응답 데이터를 기반으로 보정된 Location 객체를 반환
export function resolveLocationFromApi(params: ResolveParams): Location {
  const { koName, state, locationIndex, position } = params;

  const matched = locationIndex.find(loc => 
    (state && loc.fullAddress.includes(state) && loc.fullAddress.includes(koName)) ||
    loc.fullAddress.includes(koName)
  );

  if (matched) {
    return { ...matched, id: 'current-location', position };
  }

  const parts = state && state !== koName ? [state, koName] : [koName];
  
  return createLocation({
    id: 'current-location',
    parts,
    originalName: parts.join(' '),
    position,
  });
}
