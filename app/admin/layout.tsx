import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { requireAdmin } from "@/lib/session";

export const metadata = {
  title: "Admin | ModernStore",
};

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Products", href: "/admin/products", icon: ShoppingCart },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-56">
            <nav className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900 p-3">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Admin
              </p>
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <link.icon className="h-4 w-4 text-slate-400" />
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t border-slate-800/70" />
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ShoppingCart className="h-4 w-4 text-slate-400" />
                Back to store
              </Link>
            </nav>
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
