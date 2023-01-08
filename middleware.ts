import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  try {
    await jose.jwtVerify(
      token || "",
      new TextEncoder().encode(process.env.JWT_SECRET_SEED)
    );

    return NextResponse.next();
  } catch (error) {
    console.error(`JWT Invalid or not signed in`, { error });
    const { pathname } = request.nextUrl;
    return NextResponse.redirect(
      new URL(`/auth/login?p=${pathname}`, request.url)
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/checkout/:path*"],
};
