export interface NormalizedWeather {
  current: {
    temp: number;
    description: string;
    icon: string;
    main: string;
  };
  today: {
    tempMin: number;
    tempMax: number;
  };
  hourly: Array<{
    dt: number;
    temp: number;
    icon: string;
    main: string;
  }>;
}

export interface Position {
  lat: number;
  lon: number;
}
