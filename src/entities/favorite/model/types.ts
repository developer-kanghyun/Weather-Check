export interface Favorite {
  id: string;
  name: string;
  originalName: string;
  lat: number;
  lon: number;
  isDefault?: boolean;
}
