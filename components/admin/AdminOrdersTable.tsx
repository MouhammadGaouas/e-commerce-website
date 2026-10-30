import { formatDZD, formatOrderDate } from "@/lib/format";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import type { AdminOrder } from "@/lib/services/orders";
import type { OrderStatus } from "@/generated/prisma/enums";

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

export default function AdminOrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <p className="text-sm text-slate-400">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800/70 bg-slate-900/60">
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {orders.map((order) => {
              const status = statusStyles[order.status];
              const customerName = order.user?.name ?? order.user?.email ?? "Unknown";
              const customerEmail = order.user?.email;
              const itemCount = (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0);

              return (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{order.id}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-200">{customerName}</p>
                    {customerEmail && <p className="mt-0.5 text-xs text-slate-500">{customerEmail}</p>}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{formatDZD(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{formatOrderDate(order.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
