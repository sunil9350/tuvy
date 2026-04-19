import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card py-10 md:py-12">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <div className="min-w-0 max-w-full">
          <p className="text-lg font-extrabold">Tuvy</p>
          <p className="mt-1 text-sm font-medium text-muted">
            Make kitchen easy in 10 minutes.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-bold sm:justify-start">
            <Link className="text-brand hover:underline" href="/">
              Home
            </Link>
            <Link className="text-brand hover:underline" href="/products">
              All products
            </Link>
            <Link className="text-brand hover:underline" href="/blog">
              Blog
            </Link>
          </div>
        </div>
        <p className="max-w-full text-xs font-medium text-muted sm:max-w-[min(100%,20rem)] sm:text-right">
          © {new Date().getFullYear()} Tuvy. Marketplace links open in a new
          tab.
        </p>
      </div>
    </footer>
  );
}
