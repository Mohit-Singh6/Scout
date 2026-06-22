
// Middleware for authentication on specific paths


import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    // window.location.href='/signin'
    return Response.redirect(new URL("/signin", req.nextUrl.origin)); // Constructs the exact sign-in URL by combining the current domain (e.g., htts://localhost:3000) with the sign-in path 
  }
});

// config checks for which urls the function has to run, it will only run the function auth for these urls only, but if you don't write anything in it then it would run for each of the pages/path that you visit. 

export const config = {
  matcher: [ // Only apply middleware to these paths, it would check for these paths and redirect if not logged in
    '/sites/:path*'
  ],
};