

import { useState } from "react";

interface LatencyChartPoint {
    time: string;
    latency: number;
}

interface DayLog {
    time: string;
    uptimePerc?: number;
    status?: number;
}

interface StatusGraphProps {
    uptimeData: DayLog[];
    startDateLabel: string;
    endDateLabel: string;
    latencyData: LatencyChartPoint[];
    aiSumm: string;
    timeRangeType: "24h" | "7days" | "30days" | "custom";
}


export function StatusGraph({ uptimeData, latencyData, startDateLabel, endDateLabel, aiSumm, timeRangeType }: StatusGraphProps) {
    const [hoveredDay, setHoveredDay] = useState<DayLog | null>(null);

    function getCellColor(day: DayLog): string {
        // For 24-hour data (has status code)
        if (day.status !== undefined) {
            return getStatusCodeStyles(day.status);
        }
        // For multi-day data (has uptime percentage)
        if (day.uptimePerc !== undefined) {
            const pct = day.uptimePerc;
            if (pct >= 95) return "bg-emerald-500 hover:bg-emerald-400";       // Highest Green
            if (pct >= 70) return "bg-emerald-600/60 hover:bg-emerald-500/80"; // Lighter Green
            if (pct >= 40) return "bg-amber-500 hover:bg-amber-400";           // Yellow
            return "bg-red-500 hover:bg-red-400";                              // `Red`
        }
        return "bg-zinc-400 hover:bg-zinc-300";
    }

    function getUptimeTextColor(pct: number): string {
        if (pct >= 95) return "text-emerald-400";       // Highest Green
        if (pct >= 70) return "text-emerald-500";      // Lighter Green
        if (pct >= 40) return "text-amber-400";        // Yellow
        return "text-red-500";                          // Red
    }


    function getStatusCodeStyles(statusCode: number) {
        if (statusCode >= 200 && statusCode < 400) {
            return 'bg-emerald-500 hover:bg-emerald-400';
        }
        return 'bg-red-500 hover:bg-red-400';
    }

    return (
        <>
            <div className="my-auto flex flex-col gap-3">
                {/* Dynamic Text Box that responds to mouse hover */}
                <div className="h-5 text-sm font-mono flex items-center justify-start">
                    {hoveredDay ? (
                        <span className="text-zinc-200">
                            {hoveredDay.time}:{" "}
                            {hoveredDay.status !== undefined ? (
                                <span className={hoveredDay.status >= 200 && hoveredDay.status < 400 ? "text-emerald-400 font-semibold" : "text-red-500 font-semibold"}>
                                    {hoveredDay.status} {hoveredDay.status >= 200 && hoveredDay.status < 400 ? '(UP)' : '(DOWN)'}
                                </span>
                            ) : (
                                <span className={`font-semibold ${getUptimeTextColor(hoveredDay.uptimePerc || 0)}`}>
                                    {hoveredDay.uptimePerc}% Uptime
                                </span>
                            )}
                        </span>
                    ) : (
                        <span className="text-zinc-500">
                            {timeRangeType === '24h' ? 'Hover for status codes' : 'Hover over rows for breakdown'}
                        </span>
                    )}
                </div>

                {/* The 30 column container grid */}
                {uptimeData && uptimeData.length > 0 ? (
                    <div className="flex items-center gap-1.5 w-full h-12">
                        {uptimeData.map((day, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                                className={`flex-1 h-full rounded-[3px] cursor-pointer transition-all duration-150 hover:scale-y-115 ${getCellColor(day)}`}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-12 w-full">
                        <span className="text-xs text-zinc-500">No uptime data available for this time period</span>
                    </div>
                )}

                {/* Timeline bottom boundary metrics */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono px-0.5">
                    <span>{startDateLabel}</span>
                    <span>{endDateLabel}</span>
                </div>
            </div>


            {/* 3. Bottom Section: Incident Analysis */}
            <div className="border-t border-zinc-800/60 pt-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Incident Analysis</p>
                    <p className="text-[10px] text-zinc-500">
                        {(latencyData && latencyData.length > 0
                            ? String(latencyData[latencyData.length - 1].time)
                            : uptimeData && uptimeData.length > 0
                                ? String(uptimeData[uptimeData.length - 1].time)
                                : 'N/A'
                        ) as any}
                    </p>
                </div>
                {aiSumm ? (
                    <p className="text-sm text-zinc-300 leading-relaxed">{aiSumm}</p>
                ) : (
                    <p className="text-xs text-zinc-500 italic">No incidents recorded</p>
                )}
            </div>
        </>
    )

}
