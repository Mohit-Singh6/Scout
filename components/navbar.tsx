
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from 'next-auth/react';
import { logout } from '@/lib/actions/auth';

interface User {
  name: string,
  email: string,
  image: string,
  id: string
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const {data: session} = useSession();
  const user = session?.user as User;
  // console.log(session);
//   {
//   user: {
//     name: 'Mohit Singh',
//     email: 'mohits.it.24@nitj.ac.in',
//     image: 'https://avatars.githubusercontent.com/u/179359671?v=4',
//     id: 'cmqhm0nry000058y6ys68xd6y'
//   },
//   expires: '2026-07-17T05:25:08.501Z'
// }

  return (
    <header className="fixed left-0 right-0 top-5 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-6xl items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex size-10 items-center justify-center rounded-xl border border-zinc-800 p-2">
            <Image src="/images/logo.png" alt="Scout logo" width={26} height={26} priority />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            <span className="text-emerald-400">S</span>
            <span className="text-zinc-50">cout</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm md:hidden">
          <Link
            className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-zinc-950 transition hover:bg-emerald-700"
            href="#track"
            aria-label="Track your site"
          >
            Track
          </Link>
          <Link className="rounded-full border border-zinc-800 px-4 py-2 font-medium text-zinc-50 transition hover:bg-zinc-900" href="/signin">
            Sign in
          </Link>
        </div>

        <div className="hidden items-center gap-2 text-sm text-zinc-300 md:flex">
          {session ? (
            <>
              <Link
                href="/sites/new"
                aria-label="Add new site"
                className="grid size-9 place-items-center rounded-full border border-zinc-800 text-xl leading-none text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-600/10"
              >
                +
              </Link>
              <Link className="rounded-full px-4 py-2 transition hover:bg-zinc-900 hover:text-zinc-50" href="/dashboard">
                Dashboard
              </Link>
              <Link className="rounded-full px-4 py-2 transition hover:bg-zinc-900 hover:text-zinc-50" href="#about">
                About us
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="grid size-10 place-items-center rounded-full transition hover:bg-zinc-900/50"
                  aria-expanded={menuOpen}
                  aria-label="Open user menu"
                >
                  <Image src={user.image} alt={user.name[0]}  width={42} height={42} className="grid size-10 place-items-center rounded-full hover:opacity-90"/>
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 mt-4 w-56 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl shadow-black/50">
                    <p className="px-3 pb-3 text-sm font-medium text-zinc-50">{user.name}</p>
                    <p className="px-3 pb-3 text-sm font-medium text-zinc-50">{user.email}</p>
                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-50" onClick={logout}>
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link className="rounded-full px-4 py-2 transition hover:bg-zinc-900 hover:text-zinc-50" href="#about">
                About us
              </Link>
              <Link
                className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-zinc-950 transition hover:bg-emerald-700"
                href="#track"
              >
                Track your site
              </Link>
              <Link className="rounded-full border border-zinc-800 px-5 py-2 font-medium text-zinc-50 transition hover:bg-zinc-900" href="/signin">
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;