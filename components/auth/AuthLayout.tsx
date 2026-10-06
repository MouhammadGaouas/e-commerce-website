import React, { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo / Avatar "M" */}
        <div className="mb-6 flex flex-col items-center">
          <Link
            href="/"
            aria-label="Home"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors"
          >
            M
          </Link>
        </div>

        {/* Auth Card */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </main>
  );
}

