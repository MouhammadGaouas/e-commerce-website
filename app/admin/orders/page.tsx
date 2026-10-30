import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { listOrders } from "@/lib/services/orders";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata = {
  title: "Admin Orders | ModernStore",
};

const orderStatuses: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdmin();

  const { status, page } = await searchParams;
  const statusFilter =
    status && orderStatuses.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;
  const pageNumber = Math.max(1, Number(page ?? 1) || 1);

  const { orders, total, page: currentPage, totalPages } = await listOrders({
    status: statusFilter,
    page: pageNumber,
    pageSize: 10,
  });

  const pageHref = (pageParam?: number) => {
    const params = new URLSearchParams();
    if (statusFilter) {
      params.set("status", statusFilter);
    }
    if (pageParam && pageParam > 1) {
      params.set("page", String(pageParam));
    }
    const query = params.toString();
    return query ? `/admin/orders?${query}` : "/admin/orders";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-slate-400">
            {total} {total === 1 ? "order" : "orders"} found
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          Back to dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            !statusFilter
              ? "border-blue-500/50 bg-blue-600/10 text-blue-400"
              : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          All
        </Link>
        {orderStatuses.map((orderStatus) => (
          <Link
            key={orderStatus}
            href={`/admin/orders?status=${orderStatus}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === orderStatus
                ? "border-blue-500/50 bg-blue-600/10 text-blue-400"
                : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            {statusLabels[orderStatus]}
          </Link>
        ))}
      </div>

      <AdminOrdersTable orders={orders} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600">
              <ChevronLeft className="h-4 w-4" />
              Prev
            </span>
          )}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-600">
              Next
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
