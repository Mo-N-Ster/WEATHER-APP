// Mappa molto semplice: giorno/notte + tipo di meteo
export function getThemeClasses(weather) {
  if (!weather) {
    // tema di default
    return "bg-slate-900 text-white";
  }

  const isDay = weather.current.is_day === 1;
  const code = weather.current.condition.code;

  // Codici meteo (semplificati) da WeatherAPI
  const rainyCodes = new Set([
    1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246,
  ]);
  const snowyCodes = new Set([
    1066, 1069, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258,
  ]);
  const cloudyCodes = new Set([
    1003, 1006, 1009, 1030, 1135, 1147,
  ]);

  if (!isDay) {
    // Notte → viola scuro
    return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 text-slate-100";
  }

  if (rainyCodes.has(code)) {
    // Pioggia → blu/grigio
    return "bg-gradient-to-br from-slate-900 via-sky-900 to-slate-950 text-slate-100";
  }

  if (snowyCodes.has(code)) {
    // Neve → azzurro freddo
    return "bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-950 text-slate-100";
  }

  if (cloudyCodes.has(code)) {
    // Nuvoloso → grigio
    return "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100";
  }

  // Sole / sereno → giallo/arancio
  return "bg-gradient-to-br from-slate-900 via-amber-700 to-orange-900 text-slate-100";
}
