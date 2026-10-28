import Link from "next/link";
import {
  Package,
  Truck,
  Wallet,
  ShoppingCart,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Pencil,
} from "lucide-react";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDZD, formatOrderDate } from "@/lib/format";
import { WILAYAS } from "@/lib/wilayas";
import StatsCard from "@/components/dashboard/StatsCard";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata = {
  title: "Dashboard | ModernStore",
};

const statusStyles: Record<OrderStatus, { label: string; className: string }> =
  {
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

function computeProfileCompletion(user: {
  name: string;
  email: string;
  phone: string | null;
  wilaya: string | null;
  city: string | null;
}) {
  const fields = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(user.phone),
    Boolean(user.wilaya),
    Boolean(user.city),
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function wilayaLabel(code: string | null): string {
  if (!code) return "";
  const wilaya = WILAYAS.find((w) => w.code === code);
  return wilaya ? `${wilaya.code} — ${wilaya.name}` : code;
}

export default async function Dashboard() {
  const session = await requireSession();
  const user = session.user;

  const [orderStats, recentOrders, cartItemCount] = await Promise.all([
    prisma.order.aggregate({
      where: { userId: user.id, status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { select: { quantity: true } } },
    }),
    prisma.cartItem.count({ where: { cart: { userId: user.id } } }),
  ]);

  const inTransit = await prisma.order.count({
    where: { userId: user.id, status: { in: ["CONFIRMED", "SHIPPED"] } },
  });

  const totalSpent = orderStats._sum.total ?? 0;
  const completion = computeProfileCompletion({
    name: user.name,
    email: user.email,
    phone: user.phone ?? null,
    wilaya: user.wilaya ?? null,
    city: user.city ?? null,
  });

  const profileRows = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      value: user.email,
      missing: null,
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Phone",
      value: user.phone ?? "",
      missing: "Add phone number",
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "Wilaya",
      value: wilayaLabel(user.wilaya ?? null),
      missing: "Select wilaya",
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "City",
      value: user.city ?? "",
      missing: "Add city",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-500/20">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Welcome back, {user.name || "there"}
              </h1>
              <p className="mt-0.5 text-sm text-slate-400">
                Here&apos;s an overview of your account.
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-sm transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Package className="h-5 w-5" />}
            label="Total orders"
            value={String(orderStats._count)}
            hint="Orders you have placed so far"
          />
          <StatsCard
            icon={<Wallet className="h-5 w-5" />}
            label="Total spent"
            value={formatDZD(totalSpent)}
            hint="Excludes cancelled orders"
          />
          <StatsCard
            icon={<Truck className="h-5 w-5" />}
            label="In transit"
            value={String(inTransit)}
            hint="Confirmed or shipped orders"
          />
          <StatsCard
            icon={<Package className="h-5 w-5" />}
            label="Profile completion"
            value={`${completion}%`}
            progress={completion}
            hint={
              completion < 100
                ? "Complete your profile for faster checkout"
                : "All fields filled in"
            }
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent orders */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/70 px-6 py-4">
              <h2 className="text-base font-semibold text-white">
                Recent orders
              </h2>
              {cartItemCount > 0 && (
                <span className="rounded-full bg-blue-600/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-medium text-blue-400">
                  {cartItemCount} in cart
                </span>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-slate-400">
                  You have no orders yet.
                </p>
                <Link
                  href="/products"
                  className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-800/70">
                {recentOrders.map((order) => {
                  const status = statusStyles[order.status];
                  const itemCount = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  return (
                    <li key={order.id}>
                      <div className="flex items-center justify-between gap-4 px-6 py-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate">
                              {order.id}
                            </p>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatOrderDate(order.createdAt)} · {itemCount}{" "}
                            {itemCount === 1 ? "item" : "items"}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-slate-200 shrink-0">
                          {formatDZD(order.total)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Profile summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/70 px-6 py-4">
              <h2 className="text-base font-semibold text-white">Profile</h2>
              <Link
                href="/profile"
                className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Link>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm font-semibold text-white">{user.name}</p>

              <dl className="mt-4 space-y-3">
                {profileRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <span className="mt-0.5 text-slate-500">{row.icon}</span>
                    <div className="min-w-0">
                      <dt className="text-xs text-slate-500">{row.label}</dt>
                      <dd className="text-sm text-slate-200 truncate">
                        {row.value || (
                          <span className="text-xs italic text-slate-600">
                            {row.missing}
                          </span>
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border-t border-slate-800/70 px-6 py-4">
              <p className="text-xs text-slate-500">
                Shipping address is built from your wilaya and city at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
