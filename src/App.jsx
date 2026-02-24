import { useState } from "react";


export default function App() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">

        {/* Search bar */}
          <div className="flex items-center gap-2 mb-4">
            <input type="text" 
              placeholder="Search city..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          <button 
            className="bg-blue-500 hover:bg-blue-600 transition text-sm px-4 py-2 rounded-xl"
            onClick={() => {
              // Chiamata API per cercare la città
              console.log("Searching for:",query);
            }}  
          >
            Search
          </button>
        </div>
       
        {/* Weather card */}
        <div className="bg-slate-800 rounded-2xl p-4 shadow-lg">
          {/* Top: città + data */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Parma</h2>
              <p className="text-xs text-slate-300">Tuesday, 24 February</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-300">Italy</p>
              <p className="text-xs text-slate-400">Updated just now</p>
            </div>
          </div>

          {/* Middle: temperatura + icona */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-5xl font-bold">12°</p>
              <p className="text-sm text-slate-300">Partly cloudy</p>
            </div>
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-2xl">⛅</span>
            </div>
          </div>

          {/* Bottom: dettagli */}
          <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="bg-slate-900/40 rounded-xl p-2">
              <p className="text-[10px] uppercase text-slate-400">Humidity</p>
              <p className="text-sm font-semibold">68%</p>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-2">
              <p className="text-[10px] uppercase text-slate-400">Wind</p>
              <p className="text-sm font-semibold">12 km/h</p>
            </div>
            <div className="bg-slate-900/40 rounded-xl p-2">
              <p className="text-[10px] uppercase text-slate-400">Feels like</p>
              <p className="text-sm font-semibold">10°</p>
            </div>
          </div>
        </div>


        
        
      </div>
    </div>
  );
}
