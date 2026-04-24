import { isAuth0Configured } from "@/lib/auth0";
import { safeReturnToParam } from "@/lib/safe-return-to";
import { SignInClient } from "./sign-in-client";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  return (
    <SignInClient
      auth0Enabled={isAuth0Configured()}
      returnTo={safeReturnToParam(sp.next)}
    />
  );
}
