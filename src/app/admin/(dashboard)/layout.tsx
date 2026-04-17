import Link from "next/link";
import { LogoutButton } from "@/app/admin/(dashboard)/logout-button";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/blog", label: "View site blog" },
  { href: "/", label: "Storefront" },
] as const;

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:gap-10 md:px-6 lg:px-8">
      <aside className="shrink-0 md:w-52">
        <p className="text-lg font-extrabold tracking-tight">Tuvy</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Admin</p>
        <nav className="mt-6 flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-2xl px-3 py-2 text-sm font-semibold text-muted transition hover:bg-card hover:text-foreground hover:shadow-sm md:px-3"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
