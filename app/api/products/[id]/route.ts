import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, logError } from "@/lib/errors";
import { getSession } from "@/lib/session";
import { productUpdateSchema } from "@/lib/validation/product";

async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.role === "admin";
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return jsonError("Product not found", 404);
    }
    return NextResponse.json({ product });
  } catch (error) {
    logError("products:get-one", error);
    return jsonError("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return jsonError("Forbidden", 403);
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return jsonError("Product not found", 404);
    }

    const body = await request.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined && { name: parsed.data.name }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description }),
        ...(parsed.data.price !== undefined && { price: parsed.data.price }),
        ...(parsed.data.image !== undefined && { image: parsed.data.image }),
        ...(parsed.data.stock !== undefined && { stock: parsed.data.stock }),
        ...(parsed.data.category !== undefined && { category: parsed.data.category }),
      },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    logError("products:put", error);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return jsonError("Forbidden", 403);
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return jsonError("Product not found", 404);
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError("products:delete", error);
    return jsonError("Internal server error", 500);
  }
}
