import Link from "next/link";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-extrabold text-brand hover:underline">
            ← Tuvy store
          </Link>
          <Link href="/blog" className="text-sm font-bold text-muted hover:text-foreground">
            All posts
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
