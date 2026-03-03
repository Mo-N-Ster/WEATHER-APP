import { useState, useEffect } from "react";
import { fetchWeather } from "./services/weatherService";
import { searchCities } from "./services/searchService";

import { loadRecentSearches, saveRecentSearches, addRecentSearch, } from "./utils/recentSearches";
import { getThemeClasses } from "./utils/theme";
import { fetchForecast } from "./services/forecastService";

import { HourlyTemperatureChart } from "./components/HourlyTemperatureChart";
import { DailyTemperatureChart } from "./components/DailyTemperatureChart";

import { fetchIpLocation } from "./services/ipLocationService";



export default function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]); 
  const themeClasses = getThemeClasses(weather);
  const [forecast, setForecast] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const DEFAULT_CITY = "Parma";


  // SEARCH WITH CITY (base)
  const handleSearchWithCity = async (city) => {
    if (!city) {
      console.log("No city name provided to handleSearchWithCity");
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    console.log("🔎 Searching weather for:", city);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(city);
      console.log("🌤️ Weather data fetched:", data);
      setWeather(data);

      // se usi anche forecast:
      const forecastData = await fetchForecast(city);
      setForecast(forecastData);

      // Update recent searches 
      setRecentSearches((prev) => { 
        const updated = addRecentSearch(prev, data.location.name, 5); 
        saveRecentSearches(updated); 
        return updated; 
      });

    } catch (error) {
      console.error("❌ Error fetching weather data:", error);
      setError(error.message || "An error occurred while fetching weather data");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
      console.log("⏹ Search completed for:", city);
    }
  };


  const handleSearch = async () => {
    await handleSearchWithCity(query);
  };


  // GEOLOCATION BUTTON
  const handleUseMyLocation = async () => {
    console.log("📍 Use my location clicked");
    setLocating(true);
    setLocationError(null);
    
    
    try {
      // 1️⃣ Prova Geolocation API
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          return reject(new Error("Geolocation not supported"));
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log("📍 Browser geolocation coords:", { latitude, longitude });

      const coordQuery = `${latitude},${longitude}`;
      setQuery(coordQuery);
      await handleSearchWithCity(coordQuery);
      setLocating(false);
      return;
    } catch (geoError) {
      console.error("❌ Geolocation failed, fallback to IP:", geoError);
    }

    try {
      // 2️⃣ Fallback su IP
      const ipData = await fetchIpLocation();
      const city = ipData.city || ipData.region || ipData.country_name || DEFAULT_CITY;
      console.log("📍 City from IP:", city);

      setQuery(city);
      await handleSearchWithCity(city);
      setLocating(false);
      return;
    } catch (ipError) {
      console.error("❌ IP location failed, fallback to default city:", ipError);
    }

    // 3️⃣ Fallback finale: città di default
    try {
      console.log("📍 Using default city:", DEFAULT_CITY);
      setQuery(DEFAULT_CITY);
      await handleSearchWithCity(DEFAULT_CITY);
    } catch (defaultError) {
      console.error("❌ Default city fetch failed:", defaultError);
      setLocationError("Unable to detect your location or load default city.");
    } finally {
      setLocating(false);
    }
  };


  // INIT FROM IP LOCATION on start
  useEffect(() => {
    const initFromIp = async () => {
      try {
        console.log("🚀 Init from IP location...");
        const ipData = await fetchIpLocation();
        const city = ipData.city || ipData.region || ipData.country_name || DEFAULT_CITY;
        console.log("📍 Detected city from IP:", city);

        if (city) {
          setQuery(city);
          // usa la tua handleSearch esistente
          await handleSearchWithCity(city);
        }
      } catch (err) {
        console.error("❌ Error during IP init:", err);
      } finally {
        setInitializing(false);
      }
    };

    initFromIp();
  }, []);


  // LOAD RECENT SEARCHES
  useEffect(() => { 
    const saved = loadRecentSearches(); 
    console.log("💾 Loaded recent searches:", saved); 
    setRecentSearches(saved);
  }, []);


  // AUTOCOMPLETE
  const handleInputChange = async (value) => { 
    setQuery(value); 
    console.log("✏️ Digited:", value); 
    
    if (value.length >= 2) { 
      const results = await searchCities(value); 
      console.log("📦 Suggerimenti trovati:", results); 
      setSuggestions(results); 
    } else { 
      setSuggestions([]); 
    } 
  }; 

  const handleSuggestionClick = (city) => { 
    console.log("👉 Cliccato suggerimento:", city.name); 
    setQuery(city.name); 
    setSuggestions([]); 
    handleSearch(); 
  };  



  return (
    <div className={`min-h-screen flex items-center justify-center gap-6 ${themeClasses}`}> 
      <div className="w-full max-w-md px-4">


        {/* Search bar */}
        <div className="relative mb-4">
          <div className="flex items-center gap-2">

            <input 
              type="text" 
              placeholder="Search city..." 
              value={query} 
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("⏎ Enter premuto, lancio ricerca");
                  handleSearch();
                }
              }}
            />

            <button 
              className="bg-blue-500 hover:bg-blue-600 transition text-sm px-4 py-2 rounded-xl" 
              onClick={() => {
                console.log("🖱 Click su Search");
                handleSearch();
              }}
            >
              Search
            </button>

            {/* MENU BUTTON */}
            <button 
              className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-2" 
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="block w-4 h-[2px] bg-slate-200 mb-[3px]" />
              <span className="block w-4 h-[2px] bg-slate-200 mb-[3px]" />
              <span className="block w-4 h-[2px] bg-slate-200" />
            </button>

          </div>


          {/* MENU DROPDOWN */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-20">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-700 disabled:opacity-50" onClick={handleUseMyLocation} disabled={locating} >
                {locating ? "Locating..." : "Use my location"}
              </button>
            </div>
          )}


          {/* Autocomplete dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-slate-800 border border-slate-700 rounded-xl mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((city) => (
                <li 
                  key={city.id} 
                  className="px-3 py-2 hover:bg-slate-700 cursor-pointer" 
                  onClick={() => handleSuggestionClick(city)}
                >
                  {city.name}, {city.region}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>



        {/* LOCATION ERROR */}
        {locationError && (
          <p className="text-center text-red-400 text-xs mb-2">
            {locationError}
          </p>
        )}


        {/* RECENT SEARCHES */}
        {recentSearches.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-1">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((city) => (
                <button
                  key={city}
                  className="text-xs bg-slate-800 border border-slate-700 rounded-full px-3 py-1 hover:bg-slate-700"
                  onClick={() => {
                    console.log("🕘 Click on recent search:", city);
                    setQuery(city);
                    handleSearchWithCity(city);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}


        {/* INITIALIZING */}
        {initializing && (
          <p className="text-center text-slate-300 mb-2">Detecting your location...</p>
        )}

        {/* LOADING */}
        {loading && (
          <p className="text-center text-slate-300 mb-2">Loading...</p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-400 mb-2">{error}</p>
        )}
       

        {/* Weather card */}
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          
          {weather ? (
            <>

              {/* Top: città + data */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold"> {/* city name */}
                    {weather.location.name}
                  </h2>
                  <p className="text-xs text-slate-300"> {/* country */}
                    {weather.location.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-300"> {/* local time */}
                    {weather.location.localtime}
                  </p>
                  <p className="text-xs text-slate-400"> {/* updated time */}
                     Last updated : 
                    <span className="text-xs text-slate-300 ml-1">
                      {weather.current.last_updated}
                    </span>
                  </p>
                </div>
              </div>

              {/* Middle: temperatura + icona */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-5xl font-bold"> {/* temperature */}
                    {Math.round(weather.current.temp_c)}°
                  </p>
                  <p className="text-sm text-slate-300"> {/* condition text */}
                    {weather.current.condition.text}
                  </p>
                </div>
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                  <img 
                    src={weather.current.condition.icon} 
                    alt={weather.current.condition.text} 
                    className="w-12 h-12" 
                  />
                </div>
              </div>

              {/* Bottom: dettagli */}
              <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="bg-slate-900/40 rounded-xl p-2">
                  <p className="text-[10px] uppercase text-slate-400">
                    Humidity
                  </p>
                  <p className="text-sm font-semibold">
                    {weather.current.humidity}%
                  </p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-2">
                  <p className="text-[10px] uppercase text-slate-400">Wind</p>
                  <p className="text-sm font-semibold">
                    {weather.current.wind_kph}km/h
                  </p>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-2">
                  <p className="text-[10px] uppercase text-slate-400">Feels like</p>
                  <p className="text-sm font-semibold">
                    {Math.round(weather.current.feelslike_c)}°C 
                  </p>
                </div>
              </div> 

            </>
          ) : (
            <p className="text-sm text-slate-400">
              search for city to see the weather
            </p>
          )}


        </div>


        {forecast && (
          <>
            <HourlyTemperatureChart forecast={forecast} />
            <DailyTemperatureChart forecast={forecast} />
          </>
        )}



      </div>
    </div>
  );

}

