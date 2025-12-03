
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wind, 
  Navigation, 
  Eye, 
  CloudRain, 
  Globe, 
  Activity, 
  MapPin, 
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  Gauge
} from 'lucide-react';
import { fetchWeather, searchLocation, getIpLocation } from './services/weatherService';
import { getPilotAdvice } from './services/geminiService';
import { WeatherData, LocationData, ForecastData, FlyStatus } from './types';
import NeonCard from './components/NeonCard';
import { WolfIcon } from './components/WolfIcon';
import HourlyChart from './components/HourlyChart';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  // Initial Load - Get Geolocation (GPS -> IP Fallback)
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setLoading(true);
    setError(null);

    const handleSuccess = (loc: LocationData) => {
        setLocation(loc);
    };

    const tryIpLocation = async () => {
        try {
            const ipLoc = await getIpLocation();
            if (ipLoc) {
                handleSuccess(ipLoc);
            } else {
                setError("Could not auto-detect location. Please search manually.");
                setLoading(false);
            }
        } catch (e) {
            setError("Location services unavailable.");
            setLoading(false);
        }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSuccess({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: "Current GPS Location" 
          });
        },
        (err) => {
          console.warn("Geolocation denied or failed, trying IP...", err);
          tryIpLocation();
        },
        { timeout: 7000 }
      );
    } else {
        tryIpLocation();
    }
  };

  const updateWeather = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const { current, forecast } = await fetchWeather(location.latitude, location.longitude);
      setWeather(current);
      setForecast(forecast);
      
      // Get AI Advice
      setAnalyzing(true);
      const advice = await getPilotAdvice(current, location.name);
      setAiAdvice(advice);
      setAnalyzing(false);

    } catch (e) {
      setError("Could not fetch weather data. Please check connection.");
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      updateWeather();
    }
  }, [location, updateWeather]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const results = await searchLocation(searchQuery);
    setSearchResults(results);
  };

  const selectLocation = (loc: LocationData) => {
    setLocation(loc);
    setSearchResults([]);
    setSearchQuery('');
    setShowSearch(false);
  };

  // Logic to determine Fly Status
  const getFlyStatus = (w: WeatherData): FlyStatus => {
    if (w.windSpeed > 35 || w.windGusts > 50 || w.satellites < 6 || w.kpIndex > 6 || w.visibility < 1000) return FlyStatus.BAD;
    if (w.windSpeed > 25 || w.kpIndex > 4 || w.satellites < 10) return FlyStatus.CAUTION;
    return FlyStatus.GOOD;
  };

  const getStatusColor = (status: FlyStatus) => {
    switch (status) {
      case FlyStatus.GOOD: return 'bg-green-500/20 text-green-400 border-green-500';
      case FlyStatus.CAUTION: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case FlyStatus.BAD: return 'bg-red-500/20 text-red-400 border-red-500';
    }
  };

  const renderStatusBanner = () => {
    if (!weather) return null;
    const status = getFlyStatus(weather);
    const colorClass = getStatusColor(status);
    
    let text = "GOOD TO FLY";
    let icon = <CheckCircle className="w-8 h-8 mr-3" />;
    
    if (status === FlyStatus.CAUTION) {
      text = "CAUTION ADVISED";
      icon = <AlertTriangle className="w-8 h-8 mr-3" />;
    } else if (status === FlyStatus.BAD) {
      text = "NOT GOOD TO FLY";
      icon = <XCircle className="w-8 h-8 mr-3" />;
    }

    return (
      <div className={`w-full mb-6 rounded-lg border-2 p-4 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] ${colorClass}`}>
        {icon}
        <div className="flex flex-col">
            <h2 className="text-2xl font-tech font-bold uppercase tracking-widest">{text}</h2>
            <span className="text-xs opacity-80 uppercase">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-10 flex flex-col items-center relative overflow-x-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ 
                 backgroundImage: 'linear-gradient(#00708f 1px, transparent 1px), linear-gradient(90deg, #00708f 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>

      {/* Header */}
      <header className="w-full max-w-4xl p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00708f]/20 rounded-full border border-[#00708f] shadow-[0_0_15px_#00708f]">
                <WolfIcon className="w-8 h-8 text-[#00c2f7]" />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-tech font-bold text-white tracking-widest uppercase">
                    Wolf Style <span className="text-[#00c2f7]">Weather</span>
                </h1>
            </div>
        </div>
        <button 
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-[#00c2f7]"
        >
            <Search size={24} />
        </button>
      </header>

      {/* Location Search Modal/Dropdown */}
      {showSearch && (
        <div className="absolute top-20 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4">
            <div className="bg-[#1e1e1e] border border-[#00708f] rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        placeholder="Search city (e.g. Sao Paulo)" 
                        className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00708f]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-[#00708f] text-white p-2 rounded-lg hover:bg-[#005f7a]"><Search size={20}/></button>
                </form>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {searchResults.map((loc, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => selectLocation(loc)}
                            className="text-left p-2 hover:bg-[#00708f]/20 rounded border-b border-gray-800 text-sm text-gray-300"
                        >
                            {loc.name}
                        </button>
                    ))}
                    {searchResults.length === 0 && searchQuery && <p className="text-gray-500 text-xs text-center">No results found</p>}
                    
                    <button 
                        onClick={() => { getUserLocation(); setShowSearch(false); }} 
                        className="mt-2 text-[#00c2f7] text-xs flex items-center justify-center gap-2 hover:underline"
                    >
                        <Navigation size={12}/> Auto-Detect Location
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full max-w-4xl px-4 z-10 flex-grow">
        
        {/* Location Display & Change Option */}
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-2">
                <MapPin className="text-[#00708f] w-5 h-5" />
                <span className="text-white text-lg font-tech uppercase tracking-wider shadow-[#00c2f7] drop-shadow-[0_0_5px_rgba(0,194,247,0.5)]">
                    {location ? location.name.replace(', undefined', '') : 'Locating...'}
                </span>
                <button onClick={updateWeather} className="ml-2 text-[#00708f] hover:text-white transition-colors" title="Refresh Data">
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            {/* Explicit "Change Location" button below as requested */}
            <button 
                onClick={() => setShowSearch(true)}
                className="mt-2 text-xs text-gray-500 hover:text-[#00c2f7] flex items-center gap-1 transition-colors border-b border-transparent hover:border-[#00c2f7]"
            >
                <Edit3 size={10} /> Not here? Change Location
            </button>
        </div>

        {loading && !weather ? (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00708f] mb-4"></div>
                    <span className="text-[#00708f] animate-pulse">Scanning Atmosphere...</span>
                </div>
            </div>
        ) : error ? (
            <div className="text-red-500 text-center p-8 border border-red-900 bg-red-900/10 rounded-xl">
                {error}
                <button onClick={getUserLocation} className="block mx-auto mt-4 px-4 py-2 bg-red-900 text-white rounded">Retry Detection</button>
            </div>
        ) : weather ? (
            <>
                {renderStatusBanner()}

                {/* AI Advice Section */}
                {aiAdvice && (
                    <div className="mb-6 p-4 rounded-xl border border-[#00708f]/50 bg-[#00708f]/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#00708f]"></div>
                        <h3 className="text-[#00c2f7] text-xs font-bold uppercase mb-1 flex items-center gap-2">
                             <WolfIcon className="w-4 h-4" /> Alpha Pilot Intel
                             {analyzing && <span className="animate-pulse">...</span>}
                        </h3>
                        <p className="text-gray-300 text-sm italic leading-relaxed">"{aiAdvice}"</p>
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    
                    {/* Wind - Critical */}
                    <NeonCard 
                        title="Wind Speed"
                        value={weather.windSpeed}
                        unit="km/h"
                        icon={<Wind />}
                        subValue={`Gusts: ${weather.windGusts} km/h`}
                        color={weather.windSpeed > 30 ? 'danger' : weather.windSpeed > 20 ? 'warning' : 'default'}
                    />

                    {/* Satellites - Simulated Deterministic */}
                    <NeonCard 
                        title="Sats Visible"
                        value={weather.satellites}
                        icon={<Globe />}
                        subValue="Orbital Est."
                        color={weather.satellites < 8 ? 'danger' : weather.satellites < 12 ? 'warning' : 'success'}
                    />

                    {/* KP Index - Simulated Deterministic */}
                    <NeonCard 
                        title="Kp Index"
                        value={weather.kpIndex}
                        icon={<Activity />}
                        subValue="Solar Model"
                        color={weather.kpIndex > 5 ? 'danger' : weather.kpIndex > 4 ? 'warning' : 'success'}
                    />

                    {/* Temperature */}
                    <NeonCard 
                        title="Temp"
                        value={Math.round(weather.temperature)}
                        unit="°C"
                        icon={<span className="text-xl font-bold">°</span>}
                        subValue={weather.isDay ? "Daylight" : "Night Flight"}
                    />

                    {/* Visibility */}
                    <NeonCard 
                        title="Visibility"
                        value={(weather.visibility / 1000).toFixed(1)}
                        unit="km"
                        icon={<Eye />}
                        color={weather.visibility < 1000 ? 'danger' : 'default'}
                    />

                    {/* Pressure (New Real Data) */}
                    <NeonCard 
                        title="Pressure"
                        value={Math.round(weather.pressure)}
                        unit="hPa"
                        icon={<Gauge />}
                        subValue="QNH / Sea Level"
                    />
                </div>

                {/* Hourly Chart */}
                {forecast && <HourlyChart data={forecast} />}

            </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-600 text-xs">
        <p>Wolf Style Weather © {new Date().getFullYear()}</p>
        <p>Data provided by Open-Meteo • Fly Responsibly</p>
      </footer>
    </div>
  );
}
