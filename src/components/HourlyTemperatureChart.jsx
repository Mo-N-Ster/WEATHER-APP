import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function HourlyTemperatureChart({ forecast }) {
  if (!forecast) return null;

  const hours = forecast.forecast.forecastday[0].hour.map((h) => ({
    time: h.time.slice(11, 16), // "HH:MM"
    temp: h.temp_c,
  }));

  return (
    <div className="bg-slate-800 rounded-2xl p-4 shadow-lg mt-4">
      <h3 className="text-sm font-semibold mb-2"> Today </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hours}>

            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#ffffff" }}
              axisLine={{ stroke: "#475569" }}
              tickLine={{ stroke: "#475569" }}
            />

            <YAxis
              tick={{ fontSize: 10, fill: "#ffffff" }}
              axisLine={{ stroke: "#475569" }}
              tickLine={{ stroke: "#475569" }}
            />

            {/* Tooltip personalizzato */}
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
