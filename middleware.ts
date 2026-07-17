import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Maximum request body size in bytes (1MB)
const MAX_BODY_SIZE = 1024 * 1024;

export function middleware(request: NextRequest) {
  // Only check body size for state-changing methods
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Request body too large. Maximum size is 1MB." },
        { status: 413 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};