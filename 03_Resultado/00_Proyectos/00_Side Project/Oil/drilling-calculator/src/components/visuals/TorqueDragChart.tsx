import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDrillingStore } from "../../store/drilling-store";

export const TorqueDragChart: React.FC = () => {
  const profile = useDrillingStore(
    (state) => state.results.torqueDrag?.profile || [],
  );

  const chartData = profile.map((p: any) => ({
    depth: p.md,
    pickup: p.pickup / 1000, // k-lbs
    slackoff: p.slackoff / 1000,
  }));

  return (
    <div style={{ width: "100%", height: "300px", padding: "10px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPickup" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="5%"
                stopColor="hsl(230, 100%, 67%)"
                stopOpacity={0.1}
              />
              <stop
                offset="95%"
                stopColor="hsl(230, 100%, 67%)"
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorSlackoff" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />
          <XAxis
            type="number"
            label={{
              value: "Axial Load (k-lbs)",
              position: "insideBottom",
              offset: -5,
              fill: "#888",
              fontSize: 10,
            }}
            stroke="#555"
            fontSize={11}
          />
          <YAxis
            dataKey="depth"
            type="number"
            reversed
            label={{
              value: "MD (ft)",
              angle: -90,
              position: "insideLeft",
              fill: "#888",
              fontSize: 10,
            }}
            stroke="#555"
            fontSize={11}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 10, 15, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
            itemStyle={{ fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "10px" }} />
          <Area
            name="Pick-up"
            type="monotone"
            dataKey="pickup"
            stroke="hsl(230, 100%, 67%)"
            fillOpacity={1}
            fill="url(#colorPickup)"
            strokeWidth={2}
          />
          <Area
            name="Slack-off"
            type="monotone"
            dataKey="slackoff"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorSlackoff)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TorqueDragChart;
