export interface Location {
  id: string; 
  parts: string[]; 
  depth: number; 
  displayLabel: string;
  originalName?: string;
  position?: { lat: number; lon: number };
}
