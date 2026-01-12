import type { Location } from '../model/types';
import { createLocation } from './create-location';

export const parseRawLocation = (raw: string): Location => {
  const parts = raw.split('-').map((s) => s.trim()).filter(Boolean);
  return createLocation({
    id: raw,
    parts,
    originalName: raw
  });
}
