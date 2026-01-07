import type { Location } from '../model/types';

export function parseRawLocation(raw: string): Location {
  const parts = raw.split('-').map((s) => s.trim()).filter(Boolean);

  return {
    id: raw,
    parts,
    depth: parts.length,
    displayLabel: parts.join(' '),
    originalName: raw, // 전체 주소를 보관
  };
}
