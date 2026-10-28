import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, logError } from "@/lib/errors";
import { getSession } from "@/lib/session";

async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === "admin";
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return jsonError("Forbidden", 403);
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    logError("admin:orders:get", error);
    return jsonError("Internal server error", 500);
  }
}
