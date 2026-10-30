import { prisma } from "@/lib/prisma";
import type { Order, OrderStatus } from "@/generated/prisma/client";

export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export type ListOrdersParams = {
  status?: OrderStatus;
  page?: number;
  pageSize?: number;
};

export type OrderListResult = {
  orders: AdminOrder[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AdminOrder = Order & {
  user?: { id: string; name: string; email: string } | null;
  items?: { id: string; quantity: number }[];
};

export type UpdateOrderStatusResult =
  | { ok: true; order: Order }
  | { ok: false; error: "ORDER_NOT_FOUND" | "INVALID_STATUS" };

export async function listOrders(params: ListOrdersParams): Promise<OrderListResult> {
  const status = params.status;
  const page = params.page ?? 1;
  const pageSize = params.pageSize;

  const where = status ? { status } : undefined;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...(pageSize ? { skip: (page - 1) * pageSize, take: pageSize } : {}),
    include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: true } } },
  });

  const total = pageSize ? await prisma.order.count({ where }) : orders.length;

  return {
    orders,
    total,
    page,
    pageSize: pageSize ?? 20,
    totalPages: pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1,
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<UpdateOrderStatusResult> {
  if (!ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "INVALID_STATUS" };
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) {
    return { ok: false, error: "ORDER_NOT_FOUND" };
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } } },
  });

  return { ok: true, order: updatedOrder as AdminOrder };
}

export type PlatformStats = {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: { status: OrderStatus; count: number }[];
  newUsers: number;
  recentOrders: AdminOrder[];
};

export async function getPlatformStats(): Promise<PlatformStats> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [revenue, orderCount, ordersByStatus, newUsers, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: true } } },
    }),
  ]);

  return {
    totalRevenue: Number(revenue._sum.total ?? 0),
    totalOrders: orderCount,
    ordersByStatus: ordersByStatus.map((row) => ({
      status: row.status,
      count: row._count.status,
    })),
    newUsers,
    recentOrders,
  };
}
