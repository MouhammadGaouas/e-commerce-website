import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, logError } from "@/lib/errors";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    logError("orders:get", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST() {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    const items = cart?.items ?? [];
    if (!cart || items.length === 0) {
      return jsonError("Cart is empty", 400);
    }

    const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

    for (const item of items) {
      if (item.quantity > item.product.stock) {
        return jsonError("Insufficient stock", 409);
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: { userId, total, status: "PENDING" },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    logError("orders:post", error);
    return jsonError("Internal server error", 500);
  }
}
