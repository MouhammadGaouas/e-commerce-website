import Link from "next/link";
import { ArrowRight, Package, Truck, User, Wallet } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { getPlatformStats } from "@/lib/services/orders";
import { formatDZD } from "@/lib/format";
import StatsCard from "@/components/dashboard/StatsCard";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata = {
  title: "Admin Dashboard | ModernStore",
};

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-500/10 text-green-400 border-green-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

const awaitingActionStatuses: OrderStatus[] = ["PENDING", "CONFIRMED"];

export default async function AdminDashboardPage() {
  await requireAdmin();

  const stats = await getPlatformStats();

  const awaitingActionCount = stats.ordersByStatus
    .filter((row) => awaitingActionStatuses.includes(row.status))
    .reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Platform overview and order management.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          Back to store
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total revenue"
          value={formatDZD(stats.totalRevenue)}
          hint="Excludes cancelled orders"
        />
        <StatsCard
          icon={<Package className="h-5 w-5" />}
          label="Total orders"
          value={String(stats.totalOrders)}
          hint="All placed orders"
        />
        <StatsCard
          icon={<User className="h-5 w-5" />}
          label="New users (30d)"
          value={String(stats.newUsers)}
          hint="Registered in the last 30 days"
        />
        <StatsCard
          icon={<Truck className="h-5 w-5" />}
          label="Awaiting action"
          value={String(awaitingActionCount)}
          hint="Pending or confirmed orders"
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h2 className="text-base font-semibold text-white">Orders by status</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {stats.ordersByStatus.map((row) => (
            <div
              key={row.status}
              className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
            >
              <p className="text-xs text-slate-500">{statusStyles[row.status].label}</p>
              <p className="mt-1 text-lg font-bold text-white">{row.count}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all orders
          </Link>
        </div>
        <AdminOrdersTable orders={stats.recentOrders} />
      </section>
    </div>
  );
}
