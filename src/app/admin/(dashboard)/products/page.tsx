import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Products</h1>
          <p className="mt-1 text-sm font-medium text-muted">Add, edit, or remove storefront cards.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-4 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-hover"
        >
          New product
        </Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-black/[0.03]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background/80 text-xs font-extrabold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Slug</th>
              <th className="px-4 py-3">Price</th>
              <th className="hidden px-4 py-3 md:table-cell">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border/80 last:border-0">
                <td className="px-4 py-3 font-bold">{p.name}</td>
                <td className="hidden px-4 py-3 font-mono text-xs text-muted sm:table-cell">{p.slug}</td>
                <td className="px-4 py-3 font-semibold">{p.price}</td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">{p.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="font-bold text-brand hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm font-medium text-muted">No products yet.</p>
        ) : null}
      </div>
    </div>
  );
}
