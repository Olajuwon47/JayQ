"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasActiveStudentProfile } from "@/lib/supabase/roles";

export async function updateOwnProfileAction(_previousState, formData) {
  const supabase = await createClient();
  const { data: claimsResult, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsResult?.claims;

  if (claimsError || claims?.app_metadata?.role !== "student" || !claims.sub) {
    return { error: "You are not authorized to edit this profile.", success: "" };
  }

  if (!(await hasActiveStudentProfile(supabase, claims.sub))) {
    return { error: "Your student account is inactive or unavailable. Contact your administrator.", success: "" };
  }
  const fullName = String(formData.get("fullName") || "").trim();
  const studentId = String(formData.get("studentId") || "").trim();

  if (!fullName || !studentId) {
    return { error: "Enter your full name and student ID.", success: "" };
  }

  if (fullName.length > 120 || studentId.length > 80) {
    return { error: "One or more fields exceed the allowed length.", success: "" };
  }

  const admin = createAdminClient();
  const { data: profile, error: updateError } = await admin
    .from("profiles")
    .update({ full_name: fullName, student_id: studentId })
    .eq("id", claims.sub)
    .select("id")
    .maybeSingle();

  if (updateError || !profile) {
    return { error: "Your profile could not be updated. Try again.", success: "" };
  }

  revalidatePath("/student/profile");
  revalidatePath("/student/dashboard");
  return { error: "", success: "Your profile was updated." };
}

export async function changeOwnPasswordAction(_previousState, formData) {
  const supabase = await createClient();
  const { data: claimsResult, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsResult?.claims;

  if (claimsError || claims?.app_metadata?.role !== "student") {
    return { error: "You are not authorized to change this password.", success: "" };
  }

  if (!(await hasActiveStudentProfile(supabase, claims.sub))) {
    return { error: "Your student account is inactive or unavailable. Contact your administrator.", success: "" };
  }
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Complete all password fields.", success: "" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "The new passwords do not match.", success: "" };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
    current_password: currentPassword,
  });

  if (updateError) {
    return { error: "Password was not changed. Check your current password and try again.", success: "" };
  }

  revalidatePath("/student/profile");
  return { error: "", success: "Your password was changed." };
}
export async function completeRequiredPasswordChangeAction(_previousState, formData) {
  const supabase = await createClient();
  const { data: claimsResult, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsResult?.claims;

  if (claimsError || claims?.app_metadata?.role !== "student" || !claims.sub) {
    return { error: "Password setup is not available for this account." };
  }

  if (!(await hasActiveStudentProfile(supabase, claims.sub))) {
    return { error: "Your student account is inactive or unavailable. Contact your administrator.", success: "" };
  }
  const { data: authenticatedUserResult, error: authenticatedUserError } = await supabase.auth.getUser();
  const currentUser = authenticatedUserResult?.user;

  if (
    authenticatedUserError ||
    !currentUser ||
    currentUser.id !== claims.sub ||
    currentUser.app_metadata?.role !== "student" ||
    currentUser.app_metadata?.must_set_password !== true
  ) {
    return { error: "Password setup is not available for this account." };
  }

  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!password || !confirmPassword) {
    return { error: "Enter and confirm your password." };
  }

  if (password !== confirmPassword) {
    return { error: "The passwords do not match." };
  }

  const { error: passwordError } = await supabase.auth.updateUser({ password });

  if (passwordError) {
    return { error: "Your password could not be set. Check the password requirements and try again." };
  }

  const admin = createAdminClient();
  const { data: userResult, error: userError } = await admin.auth.admin.getUserById(claims.sub);

  if (userError || !userResult?.user || userResult.user.app_metadata?.role !== "student") {
    return { error: "Your account could not be finalized. Contact your administrator." };
  }

  const { error: metadataError } = await admin.auth.admin.updateUserById(claims.sub, {
    app_metadata: {
      ...userResult.user.app_metadata,
      role: "student",
      must_set_password: false,
    },
  });

  if (metadataError) {
    return { error: "Your password was saved, but account setup could not be completed. Contact your administrator." };
  }

  await supabase.auth.signOut();
  revalidatePath("/student/dashboard");
  revalidatePath("/student/profile");
  redirect("/login");
}