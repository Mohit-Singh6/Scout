'use client';

import {login} from "@/lib/actions/auth";

export default function SignIn() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-50">
            <h1>SignIn</h1>
            <button onClick={login}>Sign In With Github</button>
        </div>
    )
}