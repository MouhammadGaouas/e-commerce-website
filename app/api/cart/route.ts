import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, logError } from "@/lib/errors";
import { getSession } from "@/lib/session";
import { cartItemSchema } from "@/lib/validation/cart";

export async function GET() {
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

    return NextResponse.json({ cart: cart ?? null, items: cart?.items ?? [] });
  } catch (error) {
    logError("cart:get", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const body = await request.json();
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400);
    }

    const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
    if (!product) {
      return jsonError("Product not found", 404);
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parsed.data.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: product.id, quantity: parsed.data.quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    logError("cart:post", error);
    return jsonError("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const body = await request.json();
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400);
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return jsonError("Cart not found", 404);
    }

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: parsed.data.productId } },
    });
    if (!existing) {
      return jsonError("Cart item not found", 404);
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: parsed.data.quantity },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({ cart: updatedCart, item: updatedItem });
  } catch (error) {
    logError("cart:patch", error);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
      return jsonError("Unauthorized", 401);
    }

    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      return jsonError("Product id is required", 400);
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return NextResponse.json({ cart: null });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    logError("cart:delete", error);
    return jsonError("Internal server error", 500);
  }
}
