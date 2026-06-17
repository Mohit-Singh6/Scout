'use client';

import { login } from "@/lib/actions/auth";

export default function SignIn() {
    return (
        <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
            
            {/* Blur Effects */}
            <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />

            {/* Content */}
            <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 sm:px-10">
                <div className="w-full max-w-md">
                    {/* Header Section */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
                            Welcome to 
                            <span className="text-emerald-400"> S</span>
                            <span className="text-white-400">cout</span>
                        </h1>
                        <p className="text-lg text-zinc-400">
                            Monitor your portfolio projects uptime across all your hosting platforms in one unified dashboard.
                        </p>
                    </div>

                    {/* Sign In Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
                        <div className="mb-6">
                            <h2 className="mb-2 text-xl font-semibold">Get Started</h2>
                            <p className="text-sm text-zinc-400">
                                Sign in with your GitHub account to start monitoring your services.
                            </p>
                        </div>

                        {/* GitHub Sign In Button */}
                        <button
                            onClick={login}
                            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-900 px-6 py-3 font-medium text-zinc-50 transition duration-200 hover:border-emerald-400/50 hover:from-zinc-700 hover:to-zinc-800 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95"
                        >
                            {/* GitHub Icon */}
                            <svg
                                className="h-5 w-5 transition group-hover:text-emerald-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>Sign in with GitHub</span>
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-zinc-800" />
                            <span className="text-xs text-zinc-500">or</span>
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        {/* Info Text */}
                        <p className="text-center text-xs text-zinc-500">
                            We use GitHub for secure authentication. Your data is safe with us.
                        </p>
                    </div>

                    {/* Features Section */}
                    {/* <div className="mt-12 space-y-4">
                        <div className="flex gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-3 backdrop-blur-sm">
                            <span className="text-emerald-400">✓</span>
                            <span className="text-sm text-zinc-400">Monitor uptime across Vercel, Render, Railway, Neon & more</span>
                        </div>
                        <div className="flex gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-3 backdrop-blur-sm">
                            <span className="text-emerald-400">✓</span>
                            <span className="text-sm text-zinc-400">Get instant alerts when services go down</span>
                        </div>
                        <div className="flex gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-3 backdrop-blur-sm">
                            <span className="text-emerald-400">✓</span>
                            <span className="text-sm text-zinc-400">Track latency and performance metrics in real-time</span>
                        </div>
                    </div> */}
                </div>
            </div>
        </main>
    )
}