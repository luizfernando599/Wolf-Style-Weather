export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  visibility: number; // in meters
  cloudCover: number; // percentage
  kpIndex: number; // Simulated for this demo as real-time Kp APIs are rare/paid
  satellites: number; // Simulated/Estimated
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