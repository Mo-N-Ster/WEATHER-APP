import { useState } from "react";
import { fetchWeather } from "./services/weatherService";

export default function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlesearch = async () => {
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
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error.message || "An error occurred while fetching weather data");
      setWeather(null);
    } finally {
      setLoading(false);
      console.log("Search completed");
    }
  };


  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">

        {/* Search bar */}
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Search city..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("Searching for:",query);
                  handlesearch(); // Chiamata API per cercare la città
                }
              }}
            />
          <button 
            className="bg-blue-500 hover:bg-blue-600 transition text-sm px-4 py-2 rounded-xl"
            onClick={() => {
              console.log("Searching for:",query);
              handlesearch(); // Chiamata API per cercare la città
            }}  
          >
            Search
          </button>
        </div>

      {/* Stato di caricamento / errore */}
      {loading && (
        <p className="text-center text-slate-300">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-400">{error}</p>
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
                    <p className="text-xs text-slate-300">{weather.current.last_updated}</p>
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

