const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchWeather(query) {
  if (!query) {
    throw new Error("City name is required");
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&aqi=no`;

  console.log("Fetching weather data from:", url);

  const res = await fetch(url);

  console.log("API response status:", res.status, "Status text:", res.statusText);

  if (!res.ok) {
    throw new Error("City not found");
  }

  const data = await res.json();

  console.log("Fetched weather data received:", data);

  return data;
}
