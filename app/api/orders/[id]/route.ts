import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, logError } from "@/lib/errors";
import { getSession } from "@/lib/session";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return jsonError("Order not found", 404);
    }

    return NextResponse.json({ order });
  } catch (error) {
    logError("orders:get-one", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await params;
    const order = await prisma.order.findFirst({ where: { id, userId } });
    if (!order) {
      return jsonError("Order not found", 404);
    }

    if (order.status === "CANCELLED") {
      return jsonError("Order already cancelled", 400);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    logError("orders:post-one", error);
    return jsonError("Internal server error", 500);
  }
}
