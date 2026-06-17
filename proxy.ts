import { auth } from './auth';

export async function proxy() {
  const session = await auth();
  
  // You can add route protection logic here if needed
}

// Configure which routes to run proxy on
export const config = {
  matcher: [
    // Add routes that need protection here
    // "/*" means all routes, but you can specify specific routes like "/dashboard/*" or "/profile/*"
  ],
};
