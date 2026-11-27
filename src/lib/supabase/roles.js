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

export async function hasActiveStudentProfile(supabase, userId) {
  if (!userId) return false;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("active")
    .eq("id", userId)
    .maybeSingle();

  return !error && profile?.active === true;
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

  if (requiredRole === "student") {
    const supabase = await createClient();
    const { data: userResult, error: userError } = await supabase.auth.getUser();
    const user = userResult?.user;

    if (userError || !user || user.id !== claims.sub || user.app_metadata?.role !== "student") {
      redirect("/login");
    }

    if (!(await hasActiveStudentProfile(supabase, user.id))) {
      await supabase.auth.signOut();
      redirect("/login");
    }

    if (user.app_metadata?.must_set_password === true) {
      redirect("/student/set-password");
    }
  }

  return claims;
}