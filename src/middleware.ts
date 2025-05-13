// frontend middleware.ts (conceptual)
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup"];
import { DJANGO_USER_ENDPOINT } from "./config/defaults";
const API_AUTH_CHECK_URL = `${DJANGO_USER_ENDPOINT}/verify-session/`; 
import { cookies } from "next/headers";
import { decrypt } from "@/app/auth/auth_server";

// export async function middleware(req: NextRequest) {
//     const path = req.nextUrl.pathname;
//     const isProtectedRoute = protectedRoutes.includes(path);
//     const isPublicRoute = publicRoutes.includes(path);

//     let isAuthenticated = false;
//     try {
//         // Make an API call to the backend to check session validity
//         // The browser will automatically send the HttpOnly, SameSite=None, Secure cookie
//         // if it exists and is valid for api.backenddomain.com
//         const response = await fetch(API_AUTH_CHECK_URL, {
//             method: "GET",
//             headers: {
//                 // Forward original cookies if necessary, or rely on browser to send its own
//                 // For a simple check, the browser handles the session cookie automatically
//                 // if withCredentials was used during login to set it.
//                 // However, fetch by default doesn't send cookies cross-origin unless 'credentials: include'
//             },
//             credentials: 'include', // ESSENTIAL for sending cookies cross-origin with fetch
//         });

//         if (response.ok) {
//             // const userData = await response.json(); // Optionally get user data
//             isAuthenticated = true;
//             console.log("[middleware] User is authenticated by backend");
//         } else {
//             console.log("[middleware] User is NOT authenticated by backend, status:", response.status);
//         }
//     } catch (error) {
//         console.error("[middleware] Error checking auth status:", error);
//         // Network error, backend down, etc. Treat as not authenticated.
//     }

//     if (isProtectedRoute && !isAuthenticated) {
//         return NextResponse.redirect(new URL("/login", req.nextUrl));
//     }

//     if (isPublicRoute && isAuthenticated && !path.startsWith("/dashboard")) {
//         // If on a public route like /login but already authenticated, redirect to dashboard
//         return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/dashboard/:path*", "/login", "/signup"], // Apply middleware to specific paths
// };

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Decrypt the session from the cookie
    const cookieStore = await cookies();
    console.log("[middleware] my cookie store is", cookieStore);
    const cookie = cookieStore.get("session")?.value;
    console.log("[middleware] my cookie is", cookie);
    const session = await decrypt(cookie);
    console.log("[middleware] my session is: ", session);

    // 4. Redirect
    if (isProtectedRoute && !session?.userid) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (
        isPublicRoute &&
        session?.userid &&
        !req.nextUrl.pathname.startsWith("/dashboard")
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}