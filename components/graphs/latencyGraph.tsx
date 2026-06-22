import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LatencyChartPoint {
    time: string;
    latency: number;
}

interface LatencyGraphProps {
  latencyData: LatencyChartPoint[];
  timeRangeType: "24h" | "7days" | "30days" | "custom";
}
const msFormatter = (val: number) => {
    return val + "ms"
}


export function LatencyGraph ({latencyData, timeRangeType}: LatencyGraphProps) {

    return (latencyData && latencyData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData}>
                <CartesianGrid stroke="var(--chart-5)" />
                {/* Map the horizontal labels to your "time" string key */}
                <XAxis dataKey="time" stroke="#71717a" fontSize={10} interval="preserveStartEnd" // Automatically hides labels to prevent overlapping
                    minTickGap={10}             // Ensures a minimum spacing gap of 30 pixels between text blocks
                />

                {/* The vertical tracking scale */}
                <YAxis stroke="#71717a" fontSize={12} tickFormatter={(val) => msFormatter(val)} />

                <Tooltip
                    contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }} formatter={(val) => msFormatter(val as number)}
                />

                {/* This is what was missing! Maps the line curve to your "latency" integer value */}
                <Line
                    type="monotone"
                    dataKey="latency"
                    name={timeRangeType === '24h' ? "Latency" : "Avg. Latency"}
                    stroke="#10b981"  // Clean Emerald Green line
                    strokeWidth={2}
                    dot={false}       // Removes bulky node dots for a smooth premium look
                />
            </LineChart>
        </ResponsiveContainer>
        ) : (
            <div className="h-full w-full text-zinc-400 flex items-center justify-center">
                <span className="text-sm">No performance data available for this time period</span>
            </div>
        )
    )
} 
