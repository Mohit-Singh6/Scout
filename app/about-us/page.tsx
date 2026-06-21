import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, BarChart3, AlertCircle } from "lucide-react";

export default function AboutUs() {
    return (
        <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />

            {/* Blur Effects */}
            <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />
            <div className="absolute left-0 bottom-1/4 h-80 w-80 rounded-full bg-emerald-950/20 blur-3xl" />

            {/* Content */}
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="px-6 py-20 sm:px-10 lg:px-16 mt-10">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center">
                            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 mt-2">
                                <span className="text-zinc-50">Monitor Your</span>{" "}
                                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                                    Web Services
                                </span>
                            </h1>
                            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
                                Scout provides real-time monitoring and uptime tracking for your critical web services. 
                                Get instant alerts, detailed analytics, and peace of mind.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="px-6 py-16 sm:px-10 lg:px-16">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-6 text-zinc-50">Our Mission</h2>
                                <p className="text-lg text-zinc-300 mb-4">
                                    Scout was built to solve a simple problem: how can teams monitor their web services reliably 
                                    without the complexity of enterprise solutions?
                                </p>
                                <p className="text-lg text-zinc-300 mb-6">
                                    We believe monitoring should be straightforward, affordable, and accessible to teams of all sizes. 
                                    Our platform tracks your websites and API endpoints 24/7 every 15 minutes, providing the visibility you need to 
                                    maintain uptime and deliver exceptional service.
                                </p>
                                <div className="flex gap-4">
                                    <Link
                                        href="/sites"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-50 font-medium transition"
                                    >
                                        View Dashboard
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Zap className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-zinc-50 mb-2">Real-Time Monitoring</h3>
                                            <p className="text-sm text-zinc-400">Continuous checks every minute to catch issues instantly</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <BarChart3 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-zinc-50 mb-2">Detailed Analytics</h3>
                                            <p className="text-sm text-zinc-400">Track latency, uptime percentages, and historical trends</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-zinc-50 mb-2">Instant Alerts</h3>
                                            <p className="text-sm text-zinc-400">Get notified immediately when services go down</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="px-6 py-16 sm:px-10 lg:px-16">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="text-4xl font-bold mb-12 text-center text-zinc-50">Why Choose Scout?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Simple Setup",
                                    description: "Add your websites in seconds and start monitoring immediately"
                                },
                                {
                                    title: "99.9% Uptime SLA",
                                    description: "Our monitoring infrastructure is built for reliability"
                                },
                                {
                                    title: "Beautiful Dashboards",
                                    description: "Visualize your service health with intuitive, modern interfaces"
                                },
                                {
                                    title: "Status Tracking",
                                    description: "Share status pages with your users for complete transparency"
                                },
                                {
                                    title: "Performance Insights",
                                    description: "Identify latency issues and performance bottlenecks"
                                },
                                {
                                    title: "Multi-Region Checks",
                                    description: "Monitor from multiple geographic locations for accurate data"
                                }
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-6 hover:border-emerald-500/30 transition"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <h3 className="font-semibold text-zinc-50">{feature.title}</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 py-20 sm:px-10 lg:px-16">
                    <div className="mx-auto max-w-2xl">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-sm p-10 text-center">
                            <h2 className="text-3xl font-bold mb-4 text-zinc-50">Ready to Monitor?</h2>
                            <p className="text-lg text-zinc-300 mb-8">
                                Start tracking your websites today and get complete visibility into your service health.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/sites/new"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-50 font-medium transition"
                                >
                                    Add Your First Site
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/sites"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-zinc-700 bg-zinc-900/40 hover:border-emerald-500/50 text-zinc-50 font-medium transition"
                                >
                                    View Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Info */}
                <section className="px-6 py-16 sm:px-10 lg:px-16 border-t border-zinc-800">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
                                <p className="text-zinc-400">Continuous Monitoring</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-emerald-400 mb-2">15m</div>
                                <p className="text-zinc-400">Check Frequency</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-emerald-400 mb-2">100%</div>
                                <p className="text-zinc-400">Service Transparency</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
