import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrafficData } from "../types";
import { formatBps } from "../utils";

interface Props {
  history: TrafficData[];
}

export function SpeedChart({ history }: Props) {
  const chartData = history.map((d, i) => ({
    index: i,
    upload: d.txBps,
    download: d.rxBps,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="index" hide />
        <YAxis hide />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: 8 }}
          labelStyle={{ display: "none" }}
          formatter={(value, name) => [
            formatBps(Number(value)),
            name === "upload" ? "Upload" : "Download",
          ]}
        />
        <Area
          type="monotone"
          dataKey="upload"
          stroke="#3b82f6"
          fill="url(#colorUp)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="download"
          stroke="#10b981"
          fill="url(#colorDown)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
