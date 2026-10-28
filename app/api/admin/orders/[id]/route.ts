import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return jsonError("Forbidden", 403);
    }

    const { id } = await params;
    const body = await _request.json();
    const allowedStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    const status = body?.status;
    if (!allowedStatuses.includes(status)) {
      return jsonError("Invalid status", 400);
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return jsonError("Order not found", 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    logError("admin:orders:patch", error);
    return jsonError("Internal server error", 500);
  }
}
