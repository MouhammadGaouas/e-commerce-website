import { PackageX } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { listProducts } from "@/lib/services/products";
import { formatDZD } from "@/lib/format";

export const metadata = {
  title: "Admin Products | ModernStore",
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const { products, pagination } = await listProducts({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-slate-400">
            {pagination.total} {pagination.total === 1 ? "product" : "products"} in catalog
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-16 text-center">
          <div className="rounded-full bg-slate-800/80 p-4 text-slate-500">
            <PackageX className="h-10 w-10" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">No products found</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm">
            The catalog is empty or no products match the current filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800/70 bg-slate-900/60">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">ID: {product.id}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{product.category}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">{formatDZD(product.price)}</td>
                    <td className="px-6 py-4 text-slate-300">{product.stock}</td>
                    <td className="px-6 py-4 text-right text-xs text-slate-500">
                      {/* TODO(admin): create/edit product UI backed by POST/PUT/DELETE /api/products and lib/services/products.ts. Build app/admin/products/new and app/admin/products/[id] pages. */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
