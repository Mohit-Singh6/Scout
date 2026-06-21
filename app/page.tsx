"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";



const platformChecks = [
  { name: "Vercel", status: "UP", latency: "184ms", accent: "bg-emerald-400" },
  { name: "Render", status: "TIMEOUT", latency: "5.0s", accent: "bg-red-400" },
  { name: "Railway", status: "UP", latency: "241ms", accent: "bg-sky-400" },
  { name: "Neon", status: "DB OK", latency: "91ms", accent: "bg-amber-300" },
];

const featureCards = [
  {
    title: "One screen for every free tier",
    body: "Group portfolio apps from Vercel, Render, Railway, Neon, and custom hosts without opening five dashboards.",
  },
  {
    title: "Frontend and backend probes",
    body: "Scout checks public pages for 200 OK and calls backend health routes so a live shell never hides a broken database.",
  },
  {
    title: "Timeouts that mean something",
    body: "A strict response cutoff flags frozen Render wake screens as DOWN [TIMEOUT EXCEPTION] before they waste your day.",
  },
  {
    title: "AI diagnostics in one sentence",
    body: "When a service fails, terminal logs can be summarized into a short Gemini Flash badge your future self can act on.",
  },
];


export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">

      <section className="relative min-h-screen px-6 pb-20 pt-32 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,37,42,.32)_1px,transparent_1px),linear-gradient(90deg,rgba(34,37,42,.26)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-950/30 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.75)]" />
              Serverless checks every 15 minutes
            </div>

            <h1 className="text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
              Stop guessing if your portfolio is{" "}
              <span className="font-[family-name:var(--font-architects-daughter)] text-emerald-400">
                actually alive
              </span>
              .
            </h1>

            <p className="mt-7 max-w-2xl text-xl leading-8 text-zinc-300 ">
              Scout watches your scattered Vercel, Render, Railway, and Neon projects from one dashboard, catching live hidden failures.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#track"
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 text-base font-semibold text-zinc-950 transition hover:bg-emerald-700"
              >
                Track your site
              </Link>
              <Link
                href="/about-us"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 px-6 text-base font-semibold text-zinc-50 transition hover:bg-zinc-900"
              >
                See how it works
              </Link>
            </div>

            {/* <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3 text-sm">
              {["200 OK", "Health route", "AI badge"].map((item) => (
                <div key={item} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-zinc-300">
                  <span className="block text-lg font-semibold text-emerald-400">{item}</span>
                  <span>checked together</span>
                </div>
              ))}
            </div> */}
          </div>

          <div className="relative flex min-h-[520px] items-center justify-center">
            <div className="absolute h-80 w-80 rounded-full bg-emerald-950/60 blur-3xl" />
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(16,185,129,.16),transparent_58%)] opacity-20" />
              <Image
                src="/images/logo.png"
                alt="Scout logo"
                width={200}
                height={200}
                priority
                className="relative drop-shadow-[0_0_28px_rgba(52,211,153,.10)] transition duration-500 group-hover:scale-105 hover:-rotate-3"
              />

            <div className="absolute right-0 top-16 hidden w-56 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl shadow-black/50 backdrop-blur md:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Render probe</p>
              <p className="mt-2 text-lg font-semibold text-red-300">DOWN [TIMEOUT]</p>
              <p className="mt-1 text-sm text-zinc-400">Waking screen exceeded 5s cutoff.</p>
            </div>

            <div className="absolute bottom-12 left-0 hidden w-64 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-2xl shadow-black/50 backdrop-blur md:block">
              <p className="text-sm font-semibold text-zinc-50">Gemini diagnostic</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">MongoDB IP whitelist is blocking Render.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="track" className="border-y border-zinc-800 bg-[#0d0d10] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.24em] text-emerald-400">Unified dashboard</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50">All your project vitals, without dashboard hopping.</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              This section is ready for your real uptime table, Prisma history, and latency graphs once the monitoring data is connected.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="grid gap-3">
              {platformChecks.map((check) => (
                <div key={check.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`size-2.5 rounded-full ${check.accent}`} />
                    <span className="font-medium text-zinc-50">{check.name}</span>
                  </div>
                  <span className={check.status === "TIMEOUT" ? "text-red-300" : "text-emerald-400"}>{check.status}</span>
                  <span className="font-mono text-sm text-zinc-400">{check.latency}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-40 rounded-xl border border-zinc-800 bg-[linear-gradient(180deg,rgba(6,78,59,.45),rgba(9,9,11,.92))] p-4">
              <div className="flex h-full items-end gap-2">
                {[36, 54, 42, 68, 81, 44, 92, 61, 73, 48, 87, 58].map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-t bg-emerald-600/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-architects-daughter)] text-2xl text-emerald-400">Built for portfolio chaos</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-50">Scout looks past the green dot.</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                <h3 className="text-xl font-semibold text-zinc-50">{feature.title}</h3>
                <p className="mt-4 leading-7 text-zinc-400">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
