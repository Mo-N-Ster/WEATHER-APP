import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function DailyTemperatureChart({ forecast }) {
  if (!forecast) return null;

  const days = forecast.forecast.forecastday.map((d) => ({
    date: d.date,
    min: d.day.mintemp_c,
    max: d.day.maxtemp_c,
  }));

  return (
    <div className="bg-slate-800 rounded-2xl p-4 shadow-lg mt-4">
      <h3 className="text-sm font-semibold mb-2">Next 3 days</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={days}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#ffffff" }} />
            <YAxis tick={{ fontSize: 10, fill: "#ffffff" }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#000000",
                borderRadius: "12px",
                border: "none",
                color: "#ffffff",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ffffff" }}
              cursor={{ stroke: "#38bdf8", strokeWidth: 1 }}
            />

            <Line
              type="monotone"
              dataKey="min"
              stroke="#22c55e"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke="#f97316"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
