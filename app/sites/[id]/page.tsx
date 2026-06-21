'use client';


// for client components that console.log() things are printed on the client side only not on the vs code, (prints only on the browser)

import { getRouteById } from "@/lib/actions/getRouteById"
import { getWebsiteById } from "@/lib/actions/getWebsiteById"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ArrowLeft, Activity } from "lucide-react";
import { Spinner } from "@/components/ui/spinner"



import { subDays, subHours } from "date-fns";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getLatencyData } from "@/lib/actions/getLatencyData";
import { getPercentageUptime } from "@/lib/actions/getPercentageUptime";

interface MonitoredRoute {
    id: string;
    routePath: string;
    routeType: string;
    currentCondition: string;
    website: Website
}

interface Website {
    id: string;
    name: string;
    baseUrl: string;
    hostingProvider: string;
    addedAt: Date;
}

interface LatencyChartPoint {
    time: Date | string;
    latency: number;
}

interface DayLog {
    time: string;
    uptimePerc?: number;
    status?: number;
}

function getStatusCodeStyles(statusCode: number) {
    if (statusCode >= 200 && statusCode < 400) {
        return 'bg-emerald-500 hover:bg-emerald-400';
    }
    return 'bg-red-500 hover:bg-red-400';
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'OPERATIONAL':
            return {
                badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
                dot: 'bg-emerald-500',
                text: 'UP'
            };
        case 'DEGRADED':
            return {
                badge: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
                dot: 'bg-amber-500',
                text: 'DEGRADED'
            };
        case 'DOWN':
            return {
                badge: 'bg-red-950/40 text-red-300 border-red-500/30',
                dot: 'bg-red-500',
                text: 'DOWN'
            };
        case 'TIMEOUT':
            return {
                badge: 'bg-red-950/40 text-red-300 border-red-500/30',
                dot: 'bg-red-500',
                text: 'TIMEOUT'
            };
        default:
            return {
                badge: 'bg-zinc-800/40 text-zinc-400 border-zinc-600/30',
                dot: 'bg-zinc-400',
                text: 'UNKNOWN'
            };
    }
}

function getRelativeTime(date: Date | string): { relative: string; exact: string } {
    const now = new Date();
    const pastDate = new Date(date);
    const diffMs = now.getTime() - pastDate.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    let relative = '';
    if (diffSecs < 60) {
        relative = 'just now';
    } else if (diffMins < 60) {
        relative = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        relative = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
        relative = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffMonths < 12) {
        relative = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    } else {
        relative = `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    }

    const exact = pastDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return { relative, exact };
}

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ range?: string; stDate?: string; endDate?: string }>; // For: ?range=7d
}

export default function Sites({ params, searchParams }: PageProps) {
    const router = useRouter();
    const [routeId, setRouteId] = useState<string | null>(null);
    const [currentRoute, setCurrentRoute] = useState<MonitoredRoute | null>(null);
    const [website, setWebsite] = useState<Website | null>(null);
    const [allRoutes, setAllRoutes] = useState<MonitoredRoute[]>([]);
    const [isRouteSelectOpen, setIsRouteSelectOpen] = useState(false);
    const [isGraphSelectOpen, setIsGraphSelectOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingGraph, setIsLoadingGraph] = useState(false);

    const [latencyData, setLatencyData] = useState<LatencyChartPoint[]>([]);
    const [uptimeData, setUptimeData] = useState<DayLog[]>([]);

    const [hoveredDay, setHoveredDay] = useState<DayLog | null>(null);
    const [timeRangeType, setTimeRangeType] = useState<'24h' | '7days' | '30days' | 'custom'>('24h');
    const [startDateLabel, setStartDateLabel] = useState<string>('24h ago');
    const [endDateLabel, setEndDateLabel] = useState<string>('Now');

    useEffect(() => {
        const loadData = async () => {
            try {
                const { id } = await params;
                setRouteId(id);

                const [routeDataRes, websiteDataRes] = await Promise.all([
                    getRouteById(id),
                    getWebsiteById(id)
                ]);

                if (routeDataRes.data) {
                    setCurrentRoute(routeDataRes.data);
                    setWebsite(routeDataRes.data.website);
                }

                if (websiteDataRes.data) {
                    setAllRoutes(websiteDataRes.data.monitoredRoutes || []);
                }

                const { range, stDate, endDate } = await searchParams;

                let logs;
                let uptimeData;
                let startDateLocal: Date;
                let endDateLocal: Date;
                let rangeType: 'never' | '24h' | '7days' | '30days' | 'custom' = 'never';

                if (range == undefined && stDate == undefined && endDate == undefined) {
                    startDateLocal = subHours(new Date(), 24);
                    endDateLocal = new Date();
                    rangeType = '24h';
                    logs = (await getLatencyData(id, startDateLocal, endDateLocal)).data;
                    uptimeData = (await getPercentageUptime(id, startDateLocal, endDateLocal)).data;
                }
                else if (range != undefined && stDate != undefined && endDate != undefined) {
                    return {
                        error: {
                            message: "Invalid queries in the URL"
                        }
                    }
                }
                else if (range != undefined && stDate == undefined && endDate == undefined) {
                    const rangeDays = range === '1d' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 5;
                    startDateLocal = subDays(new Date(), rangeDays);
                    endDateLocal = new Date();
                    rangeType = range === '1d' ? '24h' : range === '7d' ? '7days' : range === '30d' ? '30days' : 'custom';

                    logs = (await getLatencyData(id, startDateLocal, endDateLocal)).data;
                    uptimeData = (await getPercentageUptime(id, startDateLocal, endDateLocal)).data;
                }
                else if (stDate != undefined && endDate != undefined) {
                    startDateLocal = new Date(stDate);
                    endDateLocal = new Date(endDate);
                    rangeType = 'custom';
                    logs = (await getLatencyData(id, startDateLocal, endDateLocal)).data;
                    uptimeData = (await getPercentageUptime(id, startDateLocal, endDateLocal)).data;
                }
                else {
                    return {
                        error: {
                            message: "Enter valid date interval"
                        }
                    }
                }

                setLatencyData(logs);
                setUptimeData(uptimeData);
                setTimeRangeType(rangeType as '24h' | '7days' | '30days' | 'custom');

                // Generate labels based on time range
                if (rangeType === '24h') {
                    const startTimeStr = startDateLocal.toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                    setStartDateLabel(`${startTimeStr}`);
                    setEndDateLabel('Now');
                } else if (rangeType === '7days') {
                    const startDateStr = startDateLocal.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                    setStartDateLabel(startDateStr);
                    setEndDateLabel('Today');
                } else if (rangeType === '30days') {
                    const startDateStr = startDateLocal.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                    setStartDateLabel(startDateStr);
                    setEndDateLabel('Today');
                } else if (rangeType === 'custom') {
                    const startDateStr = startDateLocal.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                    const endDateStr = endDateLocal.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                    setStartDateLabel(startDateStr);
                    setEndDateLabel(endDateStr);
                }

                console.log("UptimeData: ", uptimeData);

            } catch (error) {
                console.error('Error loading route data:', error);
            } finally {
                setIsLoading(false);
                setIsLoadingGraph(false);
            }
        };

        loadData();
    }, [params, searchParams]);

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

    function getRangeLabel(): string {
        switch (timeRangeType) {
            case '24h':
                return 'Last 24 Hours';
            case '7days':
                return 'Last 7 Days';
            case '30days':
                return 'Last 30 Days';
            case 'custom':
                return `${startDateLabel} - ${endDateLabel}`;
            default:
                return 'Filter Window';
        }
    }
    const handleRouteChange = (newRouteId: string) => {
        setIsRouteSelectOpen(false);
        router.push(`/sites/${newRouteId}`);
    };

    const handleGraphChange = (range: string | undefined, stDate: Date | undefined, endDateLocal: Date | undefined) => {
        setIsGraphSelectOpen(false);
        setIsLoadingGraph(true);


        console.log("PARAMS: ", range, stDate, endDateLocal);
        if (range !== undefined) {
            console.log("Range: ", range);
            router.push(`/sites/${routeId}?range=${range}`);
        }
        else if (stDate !== undefined && endDateLocal !== undefined) {
            const st = stDate.toISOString();
            const end = endDateLocal.toISOString();
            console.log("Date: ", st, end);
            router.push(`/sites/${routeId}?stDate=${st}&endDate=${end}`);
        }
        else return {
            error: {
                message: "Enter valid date interval"
            }
        }
    };

    const statusStyles = currentRoute ? getStatusStyles(currentRoute.currentCondition) : getStatusStyles('UNKNOWN');


    const msFormatter = (val: number) => {
        return val + "ms"
    }


    if (isLoading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
                <Spinner className="size-8" />
            </main>
        );
    }

    if (!currentRoute || !website) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-50">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
                <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
                <div className="relative flex items-center justify-center min-h-screen">
                    <div className="text-zinc-400">Route not found</div>
                </div>
            </main>
        );
    }



    return (
        <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />

            {/* Blur Effects */}
            <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />

            {/* Content */}
            <div className="relative px-6 py-8 sm:px-10 lg:px-16 mt-20">
                <div className="mx-auto max-w-7xl">
                    {/* Back Button & Header */}
                    <div className="mb-8 flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-zinc-900/50 rounded-lg transition"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-emerald-400 transition" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                <span className="text-zinc-50">{website.name}</span>
                            </h1>
                            <p className="text-sm text-zinc-400 mt-1">{website.baseUrl}</p>
                        </div>
                    </div>

                    {/* Route Selector & Status Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Route Dropdown & Info */}
                        <div className="lg:col-span-2 relative z-30">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 transition duration-200 hover:border-emerald-500/30">
                                <label className="block text-sm font-medium text-zinc-300 mb-3">
                                    Select Route
                                </label>

                                {/* Custom Dropdown */}
                                <div className="relative z-20">

                                    <button
                                        onClick={() => setIsRouteSelectOpen(!isRouteSelectOpen)}
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-50 text-left flex items-center justify-between hover:border-emerald-500/50 transition"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm text-zinc-400">Endpoint</span>
                                            <span className="font-medium">{currentRoute.routePath}</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-zinc-400 transition ${isRouteSelectOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isRouteSelectOpen && (
                                        <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                            {allRoutes.map((route) => (
                                                <button
                                                    key={route.id}
                                                    onClick={() => handleRouteChange(route.id)}
                                                    className={`w-full px-4 py-3 text-left border-b border-zinc-700/50 last:border-b-0 transition hover:bg-zinc-700/50 z-50 ${currentRoute.id === route.id ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between z-50">
                                                        <div>
                                                            <div className="font-medium text-zinc-50 z-50">{route.routePath}</div>
                                                            <div className="text-xs text-zinc-400 mt-0.5 z-50">{route.routeType}</div>
                                                        </div>
                                                        <div className={`w-2 h-2 rounded-full ${getStatusStyles(route.currentCondition).dot}`} />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>


                                {/* Route Details */}
                                <div className="mt-6 pt-6 border-t border-zinc-800/50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-zinc-400 uppercase tracking-wider">Type</p>
                                            <p className="text-sm font-medium text-zinc-50 mt-1">{currentRoute.routeType}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-400 uppercase tracking-wider">Last Checked</p>
                                            <p className="text-sm font-medium text-zinc-50 mt-1">
                                                {getRelativeTime(website.addedAt).relative}
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                {getRelativeTime(website.addedAt).exact}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 flex flex-col justify-between">
                            <div>
                                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Current Status</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-3 h-3 rounded-full ${statusStyles.dot} animate-pulse`} />
                                    <span className={`font-semibold text-lg ${statusStyles.badge.split(' ').slice(1).join(' ')}`}>
                                        {statusStyles.text}
                                    </span>
                                </div>
                            </div>
                            <div className={`px-3 py-2 rounded-lg border ${statusStyles.badge} text-sm text-center`}>
                                {statusStyles.text}
                            </div>
                        </div>
                    </div>

                    {/* Site Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-4">
                            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Hosting Provider</p>
                            <p className="text-base font-medium text-emerald-400">{website.hostingProvider}</p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-4">
                            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Routes Monitored</p>
                            <p className="text-base font-medium text-emerald-400">{allRoutes.length}</p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-4">
                            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Full Endpoint</p>
                            <p className="text-xs font-mono text-zinc-300 truncate">{website.baseUrl}{currentRoute.routePath}</p>
                        </div>
                    </div>

                    {/* Graphs Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Latency Graph Box Container */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 h-96 flex flex-col justify-between z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-zinc-300">Performance Timelines</span>

                                {/* Custom Filter Selector Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsGraphSelectOpen(!isGraphSelectOpen)}
                                        className="px-3 py-1.5 rounded-md border border-zinc-700 bg-zinc-800/60 text-xs flex items-center gap-2 hover:border-zinc-500 transition"
                                    >
                                        <span>{getRangeLabel()}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition ${isGraphSelectOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isGraphSelectOpen && (
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl z-50 overflow-hidden">
                                            <button onClick={() => handleGraphChange('1d', undefined, undefined)} className={`w-full px-3 py-2 text-left text-xs transition border-b border-zinc-700/40 ${timeRangeType === '24h' ? 'bg-emerald-500/20 border-l-2 border-l-emerald-500 text-emerald-400 font-semibold' : 'hover:bg-zinc-700 text-zinc-400'}`}>Last 24 Hours</button>
                                            <button onClick={() => handleGraphChange('7d', undefined, undefined)} className={`w-full px-3 py-2 text-left text-xs transition border-b border-zinc-700/40 ${timeRangeType === '7days' ? 'bg-emerald-500/20 border-l-2 border-l-emerald-500 text-emerald-400 font-semibold' : 'hover:bg-zinc-700 text-zinc-400'}`}>Last 7 Days</button>
                                            <button onClick={() => handleGraphChange('30d', undefined, undefined)} className={`w-full px-3 py-2 text-left text-xs transition ${timeRangeType === '30days' ? 'bg-emerald-500/20 border-l-2 border-l-emerald-500 text-emerald-400 font-semibold' : 'hover:bg-zinc-700 text-zinc-400'}`}>Last 30 Days</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!isLoadingGraph ? (

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
                                <div className="h-full w-full text-zinc-50 flex items-center justify-center">
                                    <Spinner className="size-8" />
                                </div>
                            )
                            }
                        </div>


                        {/* Status Timeline Graph */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-3 h-96 flex flex-col items-center justify-center">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 h-96 flex flex-col justify-between w-full max-w-[600px]">

                                {/* 1. Top Section: Header Info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                                        <span className="text-sm font-medium text-zinc-300">System Availability</span>
                                    </div>
                                    {/* <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                                        globalUptimeAverage % Uptime
                                    </span> */}
                                </div>

                                {/* 2. Middle Section: Hover Details & The Matrix Strip */}
                                {!isLoadingGraph ? (
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

                                            {/* Timeline bottom boundary metrics */}
                                            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono px-0.5">
                                                <span>{startDateLabel}</span>
                                                <span>{endDateLabel}</span>
                                            </div>
                                        </div>


                                        {/* 3. Bottom Section: Mini Log Feed */}
                                        <div className="border-t border-zinc-800/60 pt-4 mt-2">
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">Recent Incidents</p>
                                            <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/50">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    Minor outage recorded on Jun 15
                                                </span>
                                                <span className="text-[10px] text-zinc-500 font-mono">6 days ago</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full w-full text-zinc-50 flex items-center justify-center">
                                        <Spinner className="size-8" />
                                    </div>
                                )
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 