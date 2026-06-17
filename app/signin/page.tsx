'use client';

import {login} from "@/lib/actions/auth";

export default function SignIn() {
    return (
        <div>
            <h1>SignIn</h1>
            <button onClick={login}>Sign In With Github</button>
        </div>
    )
}