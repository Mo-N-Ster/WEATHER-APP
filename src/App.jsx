import { useState, useEffect } from "react";
import { fetchWeather } from "./services/weatherService";
import { searchCities } from "./services/searchService";

import { loadRecentSearches, saveRecentSearches, addRecentSearch, } from "./utils/recentSearches";


export default function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]); 
  
  useEffect(() => { 
    const initial = loadRecentSearches(); 
    console.log("💾 Loaded recent searches:", initial); 
    setRecentSearches(initial);
  }, []);


  const handleSearch = async () => {
    if (!query) {
      console.log("No city name entered");
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(query);
      console.log("Weather data fetched:", data);
      setWeather(data);

      const cityName = data.location.name; 
      setRecentSearches((prev) => { 
        const updated = addRecentSearch(prev, cityName, 5); 
        console.log("💾 Updated recent searches:", updated); 
        saveRecentSearches(updated); 
        return updated;
      });
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error.message || "An error occurred while fetching weather data");
      setWeather(null);
    } finally {
      setLoading(false);
      console.log("Search completed");
    }
  };


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
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">


        {/* Search bar */}
        <div className="relative mb-4">
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search city..." value={query} onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("⏎ Enter premuto, lancio ricerca");
                  handleSearch();
                }
              }}
            />

            <button className="bg-blue-500 hover:bg-blue-600 transition text-sm px-4 py-2 rounded-xl" onClick={() => {
                console.log("🖱 Click su Search");
                handleSearch();
              }}
            >
              Search
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-slate-800 border border-slate-700 rounded-xl mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((city) => (
                <li key={city.id} className="px-3 py-2 hover:bg-slate-700 cursor-pointer" onClick={() => handleSuggestionClick(city)}
                >
                  {city.name}, {city.region}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>


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
                    handleSearch();
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Loading / Error */}
        {loading && <p className="text-center text-slate-300">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

       
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

      </div>
    </div>
  );

}

