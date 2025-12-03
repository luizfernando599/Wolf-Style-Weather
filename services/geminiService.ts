import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const getPilotAdvice = async (weather: WeatherData, locationName: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return "Gemini API Key missing. Fly safely based on the data.";

    const prompt = `
        You are an expert UAV (Drone) pilot and a "Wolf Pack Leader".
        Analyze the following weather data for ${locationName} and give a short, stylish advice (max 2 sentences) on whether it is good to fly.
        Use a "Wolf" metaphor if appropriate (e.g., "The wind howls," "Clear hunting grounds").
        
        Data:
        Wind Speed: ${weather.windSpeed} km/h
        Gusts: ${weather.windGusts} km/h
        Visibility: ${weather.visibility} meters
        Kp Index: ${weather.kpIndex}
        Satellites: ${weather.satellites}
        Cloud Cover: ${weather.cloudCover}%
        
        Safety thresholds: Wind > 35km/h is dangerous. Kp > 5 is dangerous. Satellites < 10 is risky.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Data analysis unavailable. Check metrics manually.";
    } catch (error) {
        console.error("Gemini Error", error);
        return "System offline. Rely on manual instruments.";
    }
}