// OpenWeather API의 어색한 한글 번역 교정
const correctionMap: Record<string, string> = {
  '튼구름': '구름 많음',
  '온흐림': '흐림',
  '실비': '이슬비',
  '박무': '안개',
  '연무': '안개',
};

export function formatWeatherDescription(main: string | undefined, description?: string): string {
  if (description && correctionMap[description]) {
    return correctionMap[description];
  }
  return description || main || '';
}

// 온도는 정수로 표기
export function formatTemperature(temp: number | undefined): string {
  if (temp === undefined || temp === null) return '-';
  return `${Math.round(temp)}°`;
}
