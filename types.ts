
export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  visibility: number; // in meters
  cloudCover: number; // percentage
  pressure: number; // hPa
  kpIndex: number; // Calculated model
  satellites: number; // Calculated model
  isDay: boolean;
  weatherCode: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

export interface ForecastData {
  time: string[];
  windSpeed: number[];
  windGusts: number[];
}

export enum FlyStatus {
  GOOD = 'GOOD',
  CAUTION = 'CAUTION',
  BAD = 'BAD'
}
