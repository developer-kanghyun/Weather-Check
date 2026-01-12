import { type GeocodeResponse as ApiGeocodeResponse } from '@/shared/api/weather';

export type GeocodeResponse = ApiGeocodeResponse;

export interface Hourly {
  dt: number;
  temp: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // 강수 확률
}

export interface Daily {
  dt: number;
  temp: {
    min: number;
    max: number;
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number;
}

export interface Weather {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    uvi: number;
    visibility: number;
    main: string;
    description: string;
    icon: string;
  };
  today: {
    tempMin: number;
    tempMax: number;
  };
  hourly: Hourly[];
  daily: Daily[];
}


export interface FavoriteWeather extends Weather {
  locationId: string;
}
