import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartsProps {
  attackStats?: Array<{ name: string; value: number }>;
  performanceData?: Array<{ event: number; time: number }>;
}

const defaultAttackStats = [
  { name: "DDoS", value: 40 },
  { name: "Malware", value: 25 },
  { name: "SIM Swap", value: 20 },
  { name: "Other", value: 15 },
];

const defaultPerformanceData = [
  { event: 1, time: 145 },
  { event: 2, time: 167 },
  { event: 3, time: 132 },
  { event: 4, time: 189 },
  { event: 5, time: 178 },
  { event: 6, time: 156 },
  { event: 7, time: 142 },
  { event: 8, time: 198 },
  { event: 9, time: 151 },
  { event: 10, time: 164 },
];

const ATTACK_COLORS = [
  "#EF4444", // Red - DDoS
  "#F97316", // Orange - Malware
  "#3B82F6", // Blue - SIM Swap
  "#8B5CF6", // Purple - Other
];

export default function Charts({
  attackStats = defaultAttackStats,
  performanceData = defaultPerformanceData,
}: ChartsProps) {
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    setAnimateCharts(true);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Attack Types Pie Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Attack Types Distribution
        </h3>

        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attackStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                animationDuration={animateCharts ? 800 : 0}
              >
                {attackStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={ATTACK_COLORS[index % ATTACK_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-2">
          {attackStats.map((stat, index) => (
            <div
              key={stat.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      ATTACK_COLORS[index % ATTACK_COLORS.length],
                  }}
                />
                <span className="text-muted-foreground">{stat.name}</span>
              </div>
              <span className="font-semibold text-foreground">
                {stat.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Performance Line Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Detection Performance (Last 10)
        </h3>

        <p className="mb-4 text-xs text-muted-foreground">
          🎯 Target: &lt;200ms (green zone) | ⚠️ Alert: &gt;200ms (red zone)
        </p>

        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="event"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
                label={{ value: "ms", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => `${value}ms`}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={animateCharts}
                animationDuration={800}
              />
              {/* Reference line for 200ms threshold */}
              <Line
                type="linear"
                dataKey={() => 200}
                stroke="#EF4444"
                strokeDasharray="5 5"
                dot={false}
                name="Target (200ms)"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded bg-status-safe/10 p-2 text-center">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="font-semibold text-status-safe">
              {Math.round(
                performanceData.reduce((a, b) => a + b.time, 0) /
                  performanceData.length,
              )}
              ms
            </p>
          </div>
          <div className="rounded bg-status-critical/10 p-2 text-center">
            <p className="text-xs text-muted-foreground">Slowest</p>
            <p className="font-semibold text-status-critical">
              {Math.max(...performanceData.map((d) => d.time))}ms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
