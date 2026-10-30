"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Package,
  ShoppingCart,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { formatOrderDate } from "@/lib/format";

interface ProfileSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string;
    createdAt: Date;
    phone: string;
    wilaya: string;
    city: string;
  };
  orderCount: number;
  cartCount: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0] ?? "";
  const second = parts[1] ?? "";
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

export default function ProfileSidebar({
  user,
  orderCount,
  cartCount,
}: ProfileSidebarProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch {
      setIsSigningOut(false);
    }
  };

  // Compute profile readiness for express checkout
  const fields = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(user.phone),
    Boolean(user.wilaya),
    Boolean(user.city),
  ];
  const completedCount = fields.filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / fields.length) * 100);
  const isComplete = completionPercentage === 100;

  return (
    <div className="space-y-6">
      {/* Identity Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          {user.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.image}
              alt={user.name}
              className="h-16 w-16 shrink-0 rounded-full border-2 border-slate-700 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800 text-xl font-bold text-slate-100 shadow-inner">
              {getInitials(user.name)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-white">
              {user.name}
            </h2>
            <p className="truncate text-xs text-slate-400 mt-0.5" title={user.email}>
              {user.email}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {/* Role badge */}
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${
                  user.role === "admin"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {user.role === "admin" ? "Administrator" : "Customer"}
              </span>

              {/* Email verification status */}
              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                  <ShieldAlert className="h-3 w-3" />
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-800/80 pt-4 text-xs text-slate-400 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>Member since {formatOrderDate(new Date(user.createdAt))}</span>
        </div>

        {/* Profile Completion / Readiness */}
        <div className="mt-4 rounded-lg border border-slate-800/80 bg-slate-950/50 p-3.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Delivery Readiness
            </span>
            <span
              className={`font-semibold ${
                isComplete ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {completionPercentage}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isComplete ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            {isComplete
              ? "All delivery fields set — ready for swift 1-click checkout."
              : `${5 - completedCount} field${
                  5 - completedCount === 1 ? "" : "s"
                } missing for seamless delivery.`}
          </p>
        </div>
      </div>

      {/* Account Navigation Links */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 backdrop-blur-sm space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white group"
        >
          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>Orders & Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800 border border-slate-700/80 px-2 py-0.5 text-xs text-slate-400">
              {orderCount}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </div>
        </Link>

        <Link
          href="/cart"
          className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-white group"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span>Shopping Cart</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800 border border-slate-700/80 px-2 py-0.5 text-xs text-slate-400">
              {cartCount}
            </span>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Account Sign Out Action */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );
}
