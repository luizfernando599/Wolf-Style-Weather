import { WeatherData, LocationData, ForecastData } from '../types';

// Using Open-Meteo API (Free, no key required)
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const fetchWeather = async (lat: number, lon: number): Promise<{ current: WeatherData; forecast: ForecastData }> => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,visibility,is_day,weather_code',
      hourly: 'wind_speed_10m,wind_gusts_10m',
      forecast_days: '1',
      timezone: 'auto'
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    const data = await response.json();

    if (!data.current) throw new Error("Failed to fetch weather data");

    // Simulation for UAV specific metrics that standard free weather APIs don't provide easily
    // In a real production app, you might aggregate Kp from NOAA and Satellites from a GNSS almanac.
    const simulatedKp = (Math.random() * 4).toFixed(2); 
    const simulatedSats = Math.floor(Math.random() * (24 - 12) + 12); 

    const current: WeatherData = {
      temperature: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      windGusts: data.current.wind_gusts_10m,
      visibility: data.current.visibility,
      cloudCover: data.current.cloud_cover,
      isDay: !!data.current.is_day,
      weatherCode: data.current.weather_code,
      kpIndex: parseFloat(simulatedKp),
      satellites: simulatedSats
    };

    const forecast: ForecastData = {
      time: data.hourly.time,
      windSpeed: data.hourly.wind_speed_10m,
      windGusts: data.hourly.wind_gusts_10m
    };

    return { current, forecast };
  } catch (error) {
    console.error("Weather Fetch Error", error);
    throw error;
  }
};

export const searchLocation = async (query: string): Promise<LocationData[]> => {
  try {
    const response = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await response.json();
    
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      name: `${item.name}, ${item.country_code.toUpperCase()}`,
      latitude: item.latitude,
      longitude: item.longitude
    }));
  } catch (error) {
    console.error("Geocoding Error", error);
    return [];
  }
};

export const getReverseGeocoding = async (lat: number, lon: number): Promise<string> => {
    // Simple reverse geocoding approximation using OpenMeteo's timezone/location logic or a dedicated API if needed.
    // For now, we will just display coordinates if name isn't found, or try to infer.
    // Actually, OpenMeteo doesn't have a direct reverse geocode endpoint in the free tier easily accessible for names,
    // so we might default to "Current Location" or use BigDataCloud free client-side API if we wanted perfectly accurate city names.
    // For this demo, we'll try a rough fetch or just return a formatted string.
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}