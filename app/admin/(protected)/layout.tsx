import React from "react";
import { requireRole } from "@/lib/auth/require-role";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = await requireRole();

  return <AdminShell user={adminUser}>{children}</AdminShell>;
}

