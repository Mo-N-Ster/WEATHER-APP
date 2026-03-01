const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function fetchIpLocation() {
  const url = `https://api.weatherapi.com/v1/ip.json?key=${API_KEY}&q=auto:ip`;

  console.log("📍 IP location URL:", url);

  const res = await fetch(url);
  console.log("📡 IP location status:", res.status, res.statusText);

  if (!res.ok) {
    throw new Error("Error fetching IP location");
  }

  const data = await res.json();
  console.log("📦 IP location data:", data);

  return data; // contiene city, country, lat, lon, ecc.
}
