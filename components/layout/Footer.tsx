import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-md shadow-blue-500/20">
                M
              </span>
              <span className="font-semibold text-base tracking-tight text-white">
                ModernStore
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Premium electronics, functional technical apparel, and everyday curated living essentials.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Shop Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Electronics"
                  className="hover:text-white transition-colors"
                >
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Apparel"
                  className="hover:text-white transition-colors"
                >
                  Technical Apparel
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Home"
                  className="hover:text-white transition-colors"
                >
                  Home & Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Account & Help
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantee Column */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Trust & Privacy
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Orders are encrypted with end-to-end SSL security. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} ModernStore Inc. All rights reserved.</p>
          <p>Powered by Next.js 16, Prisma 7, and PostgreSQL.</p>
        </div>
      </div>
    </footer>
  );
}

