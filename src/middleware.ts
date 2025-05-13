import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/app/auth/auth_server";
// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard/*", "/reviews", "/friends", "/profile"];
const publicRoutes = ["/login", "/signup", "/"];

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
