import { NextRequest, NextResponse } from "next/server";
import { jsonError, logError } from "@/lib/errors";
import { requireAdminApi } from "@/lib/session";
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/products";
import { productUpdateSchema } from "@/lib/validation/product";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
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
    const auth = await requireAdminApi();
    if (!auth.user) {
      return auth.response;
    }

    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return jsonError("Product not found", 404);
    }

    const body = await request.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400);
    }

    const updatedProduct = await updateProduct(id, parsed.data);
    if (!updatedProduct) {
      return jsonError("Product not found", 404);
    }

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    logError("products:put", error);
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi();
    if (!auth.user) {
      return auth.response;
    }

    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return jsonError("Product not found", 404);
    }

    const deleted = await deleteProduct(id);
    if (!deleted) {
      return jsonError("Product not found", 404);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("products:delete", error);
    return jsonError("Internal server error", 500);
  }
}
