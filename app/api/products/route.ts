import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, logError } from "@/lib/errors";
import { requireAdminApi } from "@/lib/session";
import { productCreateSchema } from "@/lib/validation/product";
import { createProduct } from "@/lib/services/products";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const q = searchParams.get("q");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20) || 20));

    const where: Prisma.ProductWhereInput = {};

    if (category && category !== "all") {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (q && q.trim()) {
      where.OR = [
        { name: { contains: q.trim(), mode: "insensitive" } },
        { description: { contains: q.trim(), mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    logError("products:get", error);
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminApi();
    if (!auth.user) {
      return auth.response;
    }

    const body = await request.json();
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400);
    }

    const product = await createProduct({
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      image: parsed.data.image,
      stock: parsed.data.stock,
      category: parsed.data.category,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    logError("products:post", error);
    return jsonError("Internal server error", 500);
  }
}
