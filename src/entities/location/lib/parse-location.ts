import type { Location } from '../model/types';

export function parseRawLocation(raw: string): Location {
  return createLocation({
    id: raw,
    parts: raw.split('-').map((s) => s.trim()).filter(Boolean),
    originalName: raw
  });
}

export function createLocation(params: {
  id: string;
  parts: string[];
  originalName?: string;
  position?: { lat: number; lon: number };
}): Location {
  const { id, parts, originalName, position } = params;
  const displayLabel = parts[parts.length - 1];
  const fullAddress = parts.join(' ');
  const compactName = parts.join('').replace(/[-\s]/g, '').toLowerCase();

  return {
    id,
    parts,
    depth: parts.length,
    displayLabel,
    fullAddress,
    compactName,
    originalName,
    position,
  };
}
