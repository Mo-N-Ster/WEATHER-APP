const STORAGE_KEY = "weather_recent_searches";

export function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Error loading recent searches:", e);
    return [];
  }
}

export function saveRecentSearches(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving recent searches:", e);
  }
}

export function addRecentSearch(list, city, max = 5) {
  const withoutDup = list.filter(
    (c) => c.toLowerCase() !== city.toLowerCase()
  );
  const updated = [city, ...withoutDup].slice(0, max);
  return updated;
}
