export interface NormalizedWeather {
  current: {
    temp: number;
    description: string;
    icon: string;
    main: string;
    humidity: number;
    wind_speed: number;
    uvi: number;
    visibility: number;
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
    weather?: Array<{ main: string; icon: string }>;
  }>;
  daily: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      icon: string;
    }>;
  }>;
}

export interface Position {
  lat: number;
  lon: number;
}
