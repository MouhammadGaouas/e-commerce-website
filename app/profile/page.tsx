import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileForm from "@/components/profile/ProfileForm";

export const metadata = {
  title: "Profile & Account Settings | ModernStore",
  description:
    "Manage your personal identity, contact details, and default Algerian delivery address.",
};

export default async function ProfilePage() {
  const session = await requireSession();

  const [dbUser, orderCount, cartCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        phone: true,
        wilaya: true,
        city: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.cartItem.count({ where: { cart: { userId: session.user.id } } }),
  ]);

  const profileUser = {
    id: session.user.id,
    name: dbUser?.name ?? session.user.name,
    email: dbUser?.email ?? session.user.email,
    emailVerified:
      dbUser?.emailVerified ??
      Boolean((session.user as { emailVerified?: boolean }).emailVerified),
    image: dbUser?.image ?? session.user.image ?? null,
    phone: dbUser?.phone ?? "",
    wilaya: dbUser?.wilaya ?? "",
    city: dbUser?.city ?? "",
    role:
      dbUser?.role ??
      (session.user as { role?: string }).role ??
      "user",
    createdAt:
      dbUser?.createdAt ??
      (session.user as { createdAt?: Date }).createdAt ??
      new Date(),
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400"
        >
          <Link
            href="/"
            className="transition-colors hover:text-slate-200"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <Link
            href="/dashboard"
            className="transition-colors hover:text-slate-200"
          >
            Account
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-slate-200 font-semibold">Profile Settings</span>
        </nav>

        {/* Page Title & Context Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your personal information, delivery addresses, and account security.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Identity & Account Navigation Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <ProfileSidebar
              user={profileUser}
              orderCount={orderCount}
              cartCount={cartCount}
            />
          </aside>

          {/* Editable Profile & Delivery Settings */}
          <section className="lg:col-span-8" aria-label="Profile Form">
            <ProfileForm
              key={`${profileUser.name}-${profileUser.phone}-${profileUser.wilaya}-${profileUser.city}`}
              user={{
                name: profileUser.name,
                email: profileUser.email,
                emailVerified: profileUser.emailVerified,
                phone: profileUser.phone,
                wilaya: profileUser.wilaya,
                city: profileUser.city,
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
