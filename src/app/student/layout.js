import { Suspense } from "react";
import AuthLoading from "@/components/auth-loading";
import { requireRole } from "@/lib/supabase/roles";

export default function StudentLayout({ children }) {
  return (
    <Suspense fallback={<AuthLoading message="Loading student workspace…" />}>
      <StudentGate>{children}</StudentGate>
    </Suspense>
  );
}

async function StudentGate({ children }) {
  await requireRole("student");
  return children;
}