'use client';

import { getRouteById } from "@/lib/actions/getRouteById"
import { getWebsiteById } from "@/lib/actions/getWebsiteById"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ArrowLeft, Activity } from "lucide-react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
}

export default function Sites({params}: PageProps) {
    const router = useRouter();
    const [routeId, setRouteId] = useState<string | null>(null);
    const [currentRoute, setCurrentRoute] = useState<MonitoredRoute | null>(null);
    const [website, setWebsite] = useState<Website | null>(null);
    const [allRoutes, setAllRoutes] = useState<MonitoredRoute[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
            } catch (error) {
                console.error('Error loading route data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [params]);

    const handleRouteChange = (newRouteId: string) => {
        setIsOpen(false);
        router.push(`/sites/${newRouteId}`);
    };

    const statusStyles = currentRoute ? getStatusStyles(currentRoute.currentCondition) : getStatusStyles('UNKNOWN');

    if (isLoading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-50">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
                <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
                <div className="absolute right-0 bottom-32 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />
                <div className="relative flex items-center justify-center min-h-screen">
                    <div className="text-zinc-400">Loading...</div>
                </div>
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
                        <div className="lg:col-span-2">
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 transition duration-200 hover:border-emerald-500/30">
                                <label className="block text-sm font-medium text-zinc-300 mb-3">
                                    Select Route
                                </label>
                                
                                {/* Custom Dropdown */}
                                <div className="relative z-20">
                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-50 text-left flex items-center justify-between hover:border-emerald-500/50 transition"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm text-zinc-400">Endpoint</span>
                                            <span className="font-medium">{currentRoute.routePath}</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-zinc-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isOpen && (
                                        <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                            {allRoutes.map((route) => (
                                                <button
                                                    key={route.id}
                                                    onClick={() => handleRouteChange(route.id)}
                                                    className={`w-full px-4 py-3 text-left border-b border-zinc-700/50 last:border-b-0 transition hover:bg-zinc-700/50 z-50 ${
                                                        currentRoute.id === route.id ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500' : ''
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
                        {/* Latency Graph */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-8 h-80 flex flex-col items-center justify-center">
                            <LineChart data={data}>
                                
                            </LineChart>
                        </div>

                        {/* Status Timeline Graph */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-8 h-80 flex flex-col items-center justify-center">
                            <Activity className="w-12 h-12 text-zinc-700 mb-4" />
                            <p className="text-zinc-500 text-sm font-medium">Status Timeline</p>
                            <p className="text-zinc-600 text-xs mt-2">Graph placeholder - Chart will be inserted here</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 