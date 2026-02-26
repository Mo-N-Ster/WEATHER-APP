const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function searchCities(query) {
  if (!query) return [];

  const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}`;

  console.log("🔍 Autocomplete URL:", url);

  const res = await fetch(url);

  console.log("📡 Autocomplete status:", res.status);

  if (!res.ok) {
    console.error("❌ Autocomplete error:", res.statusText);
    return [];
  }

  const data = await res.json();

  console.log("📦 Autocomplete results:", data);

  return data; // array di città
}
