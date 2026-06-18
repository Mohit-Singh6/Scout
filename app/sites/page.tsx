import { getWebsites } from "@/lib/actions/getWebsites"
import Link from "next/link";

interface MonitoredRoute {
    id: string;
    routePath: string;
    routeType: string;
    currentCondition: string;
}

interface Website {
    id: string;
    name: string;
    baseUrl: string;
    hostingProvider: string;
    addedAt: Date;
    monitoredRoutes: MonitoredRoute[];
}

function getOverallStatus(routes: MonitoredRoute[]): 'OPERATIONAL' | 'DEGRADED' | 'DOWN' | 'TIMEOUT' {
    if (!routes || routes.length === 0) return 'OPERATIONAL';
    
    const hasDown = routes.some(r => r.currentCondition === 'DOWN');
    if (hasDown) return 'DOWN';
    
    const hasDegraded = routes.some(r => r.currentCondition === 'DEGRADED');
    if (hasDegraded) return 'DEGRADED';
    
    const hasTimedout = routes.some(r => r.currentCondition === 'TIMEOUT');
    if (hasTimedout) return 'TIMEOUT';
    
    return 'OPERATIONAL';
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'OPERATIONAL':
            return {
                badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
                dot: 'bg-emerald-400',
                text: 'UP'
            };
        case 'DEGRADED':
            return {
                badge: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
                dot: 'bg-amber-400',
                text: 'DEGRADED'
            };
        case 'DOWN':
            return {
                badge: 'bg-red-950/40 text-red-300 border-red-500/30',
                dot: 'bg-red-400',
                text: 'DOWN'
            };
        case 'TIMEOUT':
            return {
                badge: 'bg-red-950/40 text-red-300 border-red-500/30',
                dot: 'bg-red-400',
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

export default async function Sites() {
    const response = await getWebsites();
    const websites: Website[] = response.data || [];

    return (
        <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
            
            {/* Blur Effects */}
            <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute right-0 bottom-32 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />

            {/* Content */}
            <div className="relative px-6 py-20 sm:px-10 lg:px-16 mt-10">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-4xl font-bold tracking-tight">
                                Your <span className="text-emerald-400">Monitored Sites</span>
                            </h1>
                        </div>
                        <Link
                            href="/sites/new"
                            className="rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3 font-medium text-zinc-950 transition duration-200 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                        >
                            + Add Site
                        </Link>
                    </div>

                    {/* Websites List */}
                    {websites.length === 0 ? (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center backdrop-blur-xl">
                            <div className="mb-4 text-5xl">📭</div>
                            <h2 className="mb-2 text-xl font-semibold">No sites yet</h2>
                            <p className="mb-6 text-zinc-400">
                                Start monitoring your portfolio sites by adding your first one.
                            </p>
                            <Link
                                href="/sites/new"
                                className="inline-block rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3 font-medium text-zinc-950 transition duration-200 hover:from-emerald-400 hover:to-emerald-500 active:scale-95"
                            >
                                Add Your First Site
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {websites.map((website) => {
                                const status = getOverallStatus(website.monitoredRoutes);
                                const statusStyles = getStatusStyles(status);

                                return (
                                    <Link key={website.id} href={`/sites/${website.id}`}>
                                        <div className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition duration-200 hover:border-emerald-500/50 hover:bg-zinc-900/60 cursor-pointer backdrop-blur-sm">
                                            <div className="flex items-center justify-between gap-4">
                                                {/* Left Section - Site Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="mb-1 text-lg font-semibold text-zinc-50 group-hover:text-emerald-400 transition truncate">
                                                        {website.name}
                                                    </h3>
                                                    <p className="mb-2 text-sm text-zinc-400 truncate">
                                                        {website.baseUrl}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xs px-2 py-1 rounded-full bg-zinc-800/50 text-zinc-300">
                                                            {website.hostingProvider}
                                                        </span>
                                                        <span className="text-xs text-zinc-500">
                                                            {website.monitoredRoutes.length} route{website.monitoredRoutes.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Section - Status */}
                                                <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                                                    <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${statusStyles.badge}`}>
                                                        <span className={`inline-block size-2 rounded-full ${statusStyles.dot}`} />
                                                        <span className="text-sm font-medium">{statusStyles.text}</span>
                                                    </div>
                                                    <svg
                                                        className="size-5 text-zinc-500 group-hover:text-emerald-400 transition"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 