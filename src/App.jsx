
export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Search bar */}
        <div className="flex items-center gap-2 mb-4">
          <input type="text" placeholder="Search city..." className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button className="bg-blue-500 hover:bg-blue-600 transition text-sm px-4 py-2 rounded-xl">
            Search
          </button>
        </div>
        
      </div>
    </div>
  );
}
