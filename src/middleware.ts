import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and the current path is not / or /signup,
  // redirect the user to /
  if (!session && !['/signup', '/'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If user is signed in and the current path is / or /signup,
  // redirect the user to /dashboard
  if (session && ['/', '/signup'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


// import {
//   convexAuthNextjsMiddleware,
//   createRouteMatcher,
//   isAuthenticatedNextjs,
//   nextjsMiddlewareRedirect,
// } from "@convex-dev/auth/nextjs/server";

// const isPublicPage = createRouteMatcher(["/auth"]);

// export default convexAuthNextjsMiddleware((request) => {
//   if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
//     return nextjsMiddlewareRedirect(request, "/auth");
//   }
//   if (isPublicPage(request) && isAuthenticatedNextjs()) {
//     return nextjsMiddlewareRedirect(request, "/");
//   }
// });

// export const config = {
//   // The following matcher runs middleware on all routes
//   // except static assets.
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
