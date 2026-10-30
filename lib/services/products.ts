import { prisma } from "@/lib/prisma";
import type { Prisma, Product } from "@/generated/prisma/client";
import { productCreateSchema, productUpdateSchema } from "@/lib/validation/product";
import type { ProductCreateInput, ProductUpdateInput } from "@/lib/validation/product";

export type ListProductsParams = {
  category?: string;
  sort?: string;
  q?: string;
  page?: number;
  limit?: number;
};

export type ProductListResult = {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function listProducts(params: ListProductsParams): Promise<ProductListResult> {
  const category = params.category;
  const sort = params.sort;
  const q = params.q;
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, Math.max(1, params.limit ?? 20));

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

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(input: ProductCreateInput): Promise<Product | null> {
  const parsed = productCreateSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }

  return prisma.product.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      image: parsed.data.image,
      stock: parsed.data.stock,
      category: parsed.data.category,
    },
  });
}

export async function updateProduct(id: string, input: ProductUpdateInput): Promise<Product | null> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const parsed = productUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }

  return prisma.product.update({
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
}

export async function deleteProduct(id: string): Promise<boolean> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return false;
  }

  await prisma.product.delete({ where: { id } });
  return true;
}
