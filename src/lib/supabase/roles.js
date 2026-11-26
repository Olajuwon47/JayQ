import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function getVerifiedClaims() {
  await connection();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

export async function requireRole(requiredRole) {
  const claims = await getVerifiedClaims();

  if (!claims) {
    redirect("/login");
  }

  const role = claims.app_metadata?.role;

  if (role !== requiredRole) {
    if (role === "admin") {
      redirect("/admin/dashboard");
    }

    if (role === "student") {
      redirect("/student/dashboard");
    }

    redirect("/account");
  }

  return claims;
}