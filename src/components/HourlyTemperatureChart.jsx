import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function HourlyTemperatureChart({ forecast }) {
  if (!forecast) return null;

  const hours = forecast.forecast.forecastday[0].hour.map((h) => ({
    time: h.time.slice(11, 16), // "HH:MM"
    temp: h.temp_c,
  }));

  return (
    <div className="bg-slate-800 rounded-2xl p-4 shadow-lg mt-4">
      <h3 className="text-sm font-semibold mb-2">Next 24 hours</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hours}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
