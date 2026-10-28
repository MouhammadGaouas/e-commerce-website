import { NextResponse } from "next/server";

/** Consistent JSON error response for API routes. */
export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

/** Central place to log errors from API routes — never swallow them silently. */
export function logError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error);
}
