const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchForecast(city) {
  if (!city) throw new Error("City is required for forecast");

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
    city
  )}&days=3&aqi=no&alerts=no`;

  console.log("📈 Forecast URL:", url);

  const res = await fetch(url);
  console.log("📡 Forecast status:", res.status, res.statusText);

  if (!res.ok) {
    throw new Error("Error fetching forecast");
  }

  const data = await res.json();
  console.log("📦 Forecast data:", data);

  return data;
}
