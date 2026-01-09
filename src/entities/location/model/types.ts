export interface Location {
  id: string; 
  parts: string[]; 
  depth: number; 
  displayLabel: string; // 화면 표시용 (예: 사직동)
  fullAddress: string;  // 날씨 검색용 (예: 서울특별시 종로구 사직동)
  compactName: string;  // 검색 인덱스용 (공백 제거)
  originalName?: string;
  position?: { lat: number; lon: number };
}
