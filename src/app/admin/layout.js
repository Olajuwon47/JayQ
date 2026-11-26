import { Suspense } from "react";
import AuthLoading from "@/components/auth-loading";
import { requireRole } from "@/lib/supabase/roles";

export default function AdminLayout({ children }) {
  return (
    <Suspense fallback={<AuthLoading message="Loading administrator workspace…" />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }) {
  await requireRole("admin");
  return children;
}