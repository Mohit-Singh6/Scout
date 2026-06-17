import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({ // auth is a function that can be used as a middleware in the route handler (to tell if the user is signed in or not), signIn and signOut are functions that can be used to sign in and sign out the user.
    session: {
        strategy: 'jwt',
    },
    adapter: PrismaAdapter(prisma),
    providers: [Github({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
    })],
    callbacks: {

        // Don't ask me why do we use both jwt and session callbacks, but it is required to use both of jwt and session.

        async jwt({ token, user }) { // This function runs whenever a JWT is created or updated. It has direct access to the user record from your Prisma database.
            if (user) {
                // There are two options either you include as much data in the token as possible, then the payload size would increase but otherwise you would have to query the database for the user data on every request, which would be a performance hit. So it is a tradeoff between performance and payload size.
                // Other options is just include the .id in the token then the payload size would be small.
                token.id = user.id as string;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    }
});