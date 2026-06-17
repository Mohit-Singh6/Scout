"use server";

import {signIn, signOut} from '../../auth';

export const login = async () => { // the name difference (login - signin) is just to avoid confusion
    await signIn('github', {redirectTo: '/'});
}

export const logout = async () => {
    await signOut({redirectTo: '/'}); // no need to write the provider here.
}