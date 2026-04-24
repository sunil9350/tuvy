import { redirect } from "next/navigation";
import { getStorefrontAuthContext } from "@/lib/storefront-user";
import { AccountProfileFormClient } from "./profile-form-client";

export default async function AccountProfilePage() {
  const ctx = await getStorefrontAuthContext();
  if (!ctx) {
    redirect("/auth/signin?next=" + encodeURIComponent("/account/profile"));
  }
  return <AccountProfileFormClient />;
}
