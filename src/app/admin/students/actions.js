"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function createStudentAction(_previousState, formData) {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || claims?.claims?.app_metadata?.role !== "admin") {
    return { error: "You are not authorized to create student accounts.", success: "" };
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const studentId = String(formData.get("studentId") || "").trim();
  const password = String(formData.get("password") || "");

  if (!fullName || !email || !studentId || !password) {
    return { error: "Complete all fields to create the student account.", success: "" };
  }

  if (fullName.length > 120 || email.length > 254 || studentId.length > 80) {
    return { error: "One or more fields exceed the allowed length.", success: "" };
  }

  const admin = createAdminClient();
  const { data: accountResult, error: accountError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: {
      role: "student",
      must_set_password: true,
    },
  });

  const account = accountResult?.user;
  if (accountError || !account) {
    return {
      error: accountError?.message || "The student account could not be created.",
      success: "",
    };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: account.id,
    full_name: fullName,
    student_id: studentId,
    active: true,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(account.id);
    return {
      error: "The student profile could not be saved. Check the profiles table and try again.",
      success: "",
    };
  }

  revalidatePath("/admin/students");
  return {
    error: "",
    success: "Student account created for " + fullName + ". Share the temporary password securely.",
  };
}
export async function setStudentActiveAction(_previousState, formData) {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || claims?.claims?.app_metadata?.role !== "admin") {
    return { error: "You are not authorized to change student status.", success: "" };
  }

  const studentId = String(formData.get("studentId") || "");
  const nextActiveValue = String(formData.get("active") || "");

  if (!studentId || (nextActiveValue !== "true" && nextActiveValue !== "false")) {
    return { error: "The student status request is invalid.", success: "" };
  }

  const admin = createAdminClient();
  const { data: studentResult, error: studentError } = await admin.auth.admin.getUserById(studentId);

  if (studentError || studentResult?.user?.app_metadata?.role !== "student") {
    return { error: "The student account could not be found.", success: "" };
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({ active: nextActiveValue === "true" })
    .eq("id", studentId)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedProfile) {
    return { error: "Student status could not be updated. Try again.", success: "" };
  }

  revalidatePath("/admin/students");
  return { error: "", success: "Student status updated." };
}
export async function updateStudentProfileAction(_previousState, formData) {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || claims?.claims?.app_metadata?.role !== "admin") {
    return { error: "You are not authorized to edit student profiles.", success: "" };
  }

  const accountId = String(formData.get("accountId") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  const studentId = String(formData.get("studentId") || "").trim();

  if (!accountId || !fullName || !studentId) {
    return { error: "Enter the student's full name and student ID.", success: "" };
  }

  if (fullName.length > 120 || studentId.length > 80) {
    return { error: "One or more fields exceed the allowed length.", success: "" };
  }

  const admin = createAdminClient();
  const { data: studentResult, error: studentError } = await admin.auth.admin.getUserById(accountId);

  if (studentError || studentResult?.user?.app_metadata?.role !== "student") {
    return { error: "The student account could not be found.", success: "" };
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({ full_name: fullName, student_id: studentId })
    .eq("id", accountId)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedProfile) {
    return { error: "Student details could not be updated. Try again.", success: "" };
  }

  revalidatePath("/admin/students");
  return { error: "", success: "Student details saved." };
}
