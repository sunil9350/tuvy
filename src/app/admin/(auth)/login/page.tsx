import { AdminLoginForm } from "@/app/admin/(auth)/login/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const nextPath = sp.next && sp.next.startsWith("/") ? sp.next : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AdminLoginForm nextPath={nextPath} />
    </div>
  );
}
