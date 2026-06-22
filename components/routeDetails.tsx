
import { differenceInDays, differenceInHours, differenceInMinutes, format, parse } from "date-fns";


interface Website {
    id: string;
    name: string;
    baseUrl: string;
    hostingProvider: string;
    addedAt: Date;
}

interface MonitoredRoute {
    id: string;
    routePath: string;
    routeType: string;
    currentCondition: string;
    website: Website
}

interface LatencyChartPoint {
    time: string;
    latency: number;
}

interface RouteDetailsProps {
    latencyData: LatencyChartPoint[];
    currentRoute: MonitoredRoute;
}

export function RouteDetails({latencyData, currentRoute} : RouteDetailsProps) {

    
    function parseFlexibleDateString(dateStr: string): Date {
        const baseDate = new Date(); // Fallback reference for missing year details

        // 1. Check if the string contains a time element (e.g., "Jun 22 14:30" vs "Jun 22")
        const hasTime = dateStr.includes(":");

        
        if (hasTime) {
            const timeString = format(new Date(dateStr), "MMM dd, hh:mm a"); // because your computer's local clock is outputting a single-digit hour (like 8:34 AM instead of 08:34 AM).
            // date-fns is extremely strict—if there is a tiny mismatch in spaces or digit lengths, it crashes completely.
            return parse(timeString, "MMM dd, hh:mm a", baseDate);
        } else {
            // Expected format match: "Jun 22" (No time data available)
            return parse(dateStr, "MMM dd", baseDate);
        }
    }

    return (
    <div className="mt-6 pt-6 border-t border-zinc-800/50">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Type</p>
                <p className="text-sm font-medium text-zinc-50 mt-1">{currentRoute.routeType}</p>
            </div>
            <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Last Checked</p>
                <p className="text-sm font-medium text-zinc-50 mt-1">
                    {latencyData && latencyData.length > 0
                        ? (() => {
                            const lastCheckTime = parseFlexibleDateString(latencyData[latencyData.length - 1].time);
                            console.log(lastCheckTime);

                            // For now, show a dynamic relative time
                            const now = new Date();
                            const differenceMn = differenceInMinutes(now, lastCheckTime);
                            const differenceHrs = differenceInHours(now, lastCheckTime);
                            const differenceDays = differenceInDays(now, lastCheckTime);

                            let relativeTime = 'Just now';
                            if (differenceMn > 1) relativeTime = `${differenceMn} min${differenceMn > 1 ? 's' : ''} ago`;
                            if (differenceHrs > 0) relativeTime = `${differenceHrs} hour${differenceHrs > 1 ? 's' : ''} ago`;
                            if (differenceDays > 0) relativeTime = `${differenceDays} day${differenceDays > 1 ? 's' : ''} ago`;

                            return relativeTime;
                        })()
                        : 'Never'
                    }
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                    {latencyData && latencyData.length > 0
                        ? String(latencyData[latencyData.length - 1].time)
                        : 'No data'
                    }
                </p>
            </div>
        </div>
    </div>
    )
}