import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50 flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />

            {/* Blur Effects */}
            <div className="absolute left-1/2 top-32 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />
            <div className="absolute right-0 bottom-32 h-96 w-96 rounded-full bg-emerald-950/20 blur-3xl" />

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center px-6 py-20 text-center mt-8">
                <div className="mb-8">
                    <div className="text-8xl font-bold text-emerald-400 mb-4">404</div>
                    <h1 className="text-4xl font-bold tracking-tight mb-3">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 px-8 py-3 font-medium text-zinc-950 transition duration-200 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <Link
                        href="/sites"
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-8 py-3 font-medium text-zinc-300 transition duration-200 hover:border-zinc-600 hover:bg-zinc-900 active:scale-95"
                    >
                        View Dashboard
                    </Link>
                </div>

                <div className="mt-16 p-6 rounded-lg border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm max-w-sm">
                    <p className="text-sm text-zinc-400">
                        Having trouble? Try:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-500">
                        <li>• Checking the URL for typos</li>
                        <li>• Going back to the previous page</li>
                        <li>• Starting fresh from the home page</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
