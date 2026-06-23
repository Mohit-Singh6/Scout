import { getWebsites } from "@/lib/actions/getWebsites"
import { Activity, ArrowUpRight, Gauge, Globe2, Plus, Radar, Route, Server, ShieldCheck } from "lucide-react";
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

const providerAccent: Record<string, string> = {
    VERCEL: "border-white/20 bg-white/10 text-zinc-100",
    RENDER: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    RAILWAY: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    NETLIFY: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    GITHUB_PAGES: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
    SUPABASE: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    OTHER: "border-amber-400/20 bg-amber-400/10 text-amber-200",
};

function formatProvider(provider: string) {
    return provider.replace(/_/g, " ");
}

function countRoutesByType(routes: MonitoredRoute[], routeType: string) {
    return routes.filter((route) => route.routeType === routeType).length;
}

export default async function Sites() {
    const response = await getWebsites();
    const websites: Website[] = response.data || [];
    const totalRoutes = websites.reduce((sum, website) => sum + website.monitoredRoutes.length, 0);
    const operationalSites = websites.filter((website) => getOverallStatus(website.monitoredRoutes) === "OPERATIONAL").length;
    const attentionSites = Math.max(websites.length - operationalSites, 0);

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
            <div className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute bottom-24 right-0 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />

            <div className="relative px-6 pb-20 pt-36 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
                                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.75)]" />
                                Portfolio command center
                            </div>
                            <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
                                Your monitored sites, tuned for quick reads.
                            </h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                                Scan every project, route, and provider from one cockpit without losing the quiet Scout feel.
                            </p>
                        </div>
                        <Link
                            href="/sites/new"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500 active:scale-[.98]"
                        >
                            <Plus className="size-4" />
                            Add Site
                        </Link>
                    </div>

                    <section className="mb-8 grid gap-3 sm:grid-cols-3">
                        {[
                            { label: "Sites watched", value: websites.length, icon: Globe2 },
                            { label: "Routes checked", value: totalRoutes, icon: Route },
                            { label: "Need attention", value: attentionSites, icon: Activity },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-zinc-400">{stat.label}</span>
                                    <stat.icon className="size-4 text-emerald-400" />
                                </div>
                                <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">{stat.value}</p>
                            </div>
                        ))}
                    </section>
                    {websites.length === 0 ? (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-12">
                            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                <Radar className="size-7" />
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight">No sites on the radar yet</h2>
                            <p className="mx-auto mt-3 max-w-md text-zinc-400">
                                Add a portfolio app and Scout will start tracking its public pages and health routes.
                            </p>
                            <Link
                                href="/sites/new"
                                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 font-semibold text-zinc-950 transition hover:bg-emerald-500"
                            >
                                <Plus className="size-4" />
                                Add Your First Site
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {websites.map((website) => {
                                const status = getOverallStatus(website.monitoredRoutes);
                                const statusStyles = getStatusStyles(status);
                                const hasRoutes = website.monitoredRoutes.length > 0;
                                const providerStyle = providerAccent[website.hostingProvider] || providerAccent.OTHER;
                                const frontendRoutes = countRoutesByType(website.monitoredRoutes, "FRONTEND_PAGE");
                                const backendRoutes = countRoutesByType(website.monitoredRoutes, "BACKEND_HEALTH");

                                const cardContent = (
                                    <>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${providerStyle}`}>
                                                        {formatProvider(website.hostingProvider)}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles.badge}`}>
                                                        <span className={`size-1.5 rounded-full ${statusStyles.dot}`} />
                                                        {statusStyles.text}
                                                    </span>
                                                </div>
                                                <h3 className="truncate text-xl font-semibold tracking-tight text-zinc-50 transition group-hover:text-emerald-300">
                                                    {website.name}
                                                </h3>
                                                <p className="mt-2 truncate text-sm text-zinc-400">{website.baseUrl}</p>
                                            </div>
                                            {hasRoutes ? (
                                                <ArrowUpRight className="mt-1 size-5 shrink-0 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                                            ) : null}
                                        </div>

                                        <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
                                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                                                <Gauge className="mb-2 size-4 text-emerald-400" />
                                                <span className="block text-lg font-semibold text-zinc-50">{website.monitoredRoutes.length}</span>
                                                <span className="text-xs text-zinc-500">Routes</span>
                                            </div>
                                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                                                <Globe2 className="mb-2 size-4 text-zinc-300" />
                                                <span className="block text-lg font-semibold text-zinc-50">{frontendRoutes}</span>
                                                <span className="text-xs text-zinc-500">Frontend</span>
                                            </div>
                                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                                                <Server className="mb-2 size-4 text-zinc-300" />
                                                <span className="block text-lg font-semibold text-zinc-50">{backendRoutes}</span>
                                                <span className="text-xs text-zinc-500">Backend</span>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4">
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <ShieldCheck className="size-4 text-emerald-400/80" />
                                                Added {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(website.addedAt))}
                                            </div>
                                            {!hasRoutes ? (
                                                <Link
                                                    href={`/edit/${website.id}`}
                                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
                                                >
                                                    <Plus className="size-4" />
                                                    Add first route
                                                </Link>
                                            ) : (
                                                <span className="text-sm font-medium text-zinc-400 transition group-hover:text-emerald-300">
                                                    Open details
                                                </span>
                                            )}
                                        </div>
                                    </>
                                );

                                return hasRoutes ? (
                                    <Link key={website.id} href={`/sites/${website.monitoredRoutes[0].id}`} className="group block">
                                        <article className="h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-2xl shadow-black/20 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-zinc-900/70 hover:shadow-emerald-950/20">
                                            {cardContent}
                                        </article>
                                    </Link>
                                ) : (
                                    <article key={website.id} className="group h-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-2xl shadow-black/20 backdrop-blur transition duration-200 hover:border-emerald-400/30 hover:bg-zinc-900/70">
                                        {cardContent}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 
