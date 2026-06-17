// Agar error na pasand hon to middleware.ts (is file ka name) mat change karna!

// Not available on official docs (should've been), but this is how you can use the auth function as a middleware in the route handler to check if the user is signed in or not.

import { auth } from './auth';

export async function middleware() {
  const session = await auth();
  
  // You can add route protection logic here if needed
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Add routes that need protection here
    // "/*" means all routes, but you can specify specific routes like "/dashboard/*" or "/profile/*"
  ],
};