import { requireSession } from "@/lib/session";
import ProfileForm from "@/components/profile/ProfileForm";

export const metadata = {
  title: "Profile | ModernStore",
};

export default async function ProfilePage() {
  const session = await requireSession();
  const { user } = session;

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Your profile
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your personal information and delivery details.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              phone: user.phone ?? "",
              wilaya: user.wilaya ?? "",
              city: user.city ?? "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
