const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchWeather(query) {
  if (!query) {
    throw new Error("City name is required");
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&aqi=no`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("City not found");
  }

  const data = await res.json();
  return data;
}
