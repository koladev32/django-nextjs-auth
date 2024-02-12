import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { store } from "@/redux-lib/store";

export function middleware(request: NextRequest) {
  const { auth } = store().getState();

  if (auth?.isAuthenticated && request.nextUrl.pathname !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!auth?.isAuthenticated && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};
