import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

/** Session or redirect to sign-in. Use in server components/pages. */
export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session;
}

export type AdminUser = {
  id: string;
  role: string;
};

export type AdminAuthResult =
  | { user: AdminUser; response: null }
  | { user: null; response: NextResponse };

/** Session user when the caller is an admin, otherwise null. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (user?.role !== "admin") return null;
  return { id: user.id, role: user.role };
}

/** Session user, or redirect to sign-in when signed out / redirect to /dashboard when not admin. Use in admin server components/pages. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });
  if (user?.role !== "admin") {
    redirect("/dashboard");
  }
  return session;
}

/** Admin user, or a ready-made 401/403 JSON response. Use in admin API routes. */
export async function requireAdminApi(): Promise<AdminAuthResult> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      user: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (user?.role !== "admin") {
    return { user: null, response: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }
  return { user: { id: user.id, role: user.role }, response: null };
}
