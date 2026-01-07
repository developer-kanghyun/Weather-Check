import rawDistricts from '@/shared/assets/data/korea_districts.json';
import { parseRawLocation, type Location } from '@/entities/location';

export const locationIndex: Location[] = (rawDistricts as string[]).map(parseRawLocation);
