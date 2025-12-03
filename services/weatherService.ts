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

export const getIpLocation = async (): Promise<LocationData | null> => {
  try {
    // Attempt 1: ipapi.co (HTTPS compatible)
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error("Primary IP API failed");
    
    const data = await response.json();
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        name: `${data.city}, ${data.country_name}`
      };
    }
    throw new Error("Invalid data from primary IP API");
  } catch (error) {
    console.warn("Primary IP location failed, trying fallback...", error);
    // Attempt 2: ipwho.is (Free, HTTPS)
    try {
      const fallbackResponse = await fetch('https://ipwho.is/');
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.success) {
        return {
          latitude: fallbackData.latitude,
          longitude: fallbackData.longitude,
          name: `${fallbackData.city}, ${fallbackData.country}`
        };
      }
    } catch (e) {
      console.error("All IP geolocation methods failed", e);
    }
    return null;
  }
};

export const getReverseGeocoding = async (lat: number, lon: number): Promise<string> => {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}