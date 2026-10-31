import React from "react";
import { requireRole } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminSystemSettingsPage() {
  await requireRole(["owner"]);
  const supabase = createClient();

  const { data: admins } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-heading text-lucky-dark">
          System Administration
        </h1>
        <p className="text-sm text-lucky-mutedText">
          Manage administrator roles, security policies, and environment status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authorized Admin Accounts</CardTitle>
          <CardDescription>
            Admin roles control access permissions across media, catalog, quotes, and settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-lucky-borderLight text-xs text-lucky-mutedText uppercase font-semibold">
                  <th className="py-3 px-4">Admin Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lucky-borderLight">
                {admins && admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-semibold text-lucky-dark">
                        {admin.full_name || "Admin"}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-lucky-mutedText">
                        {admin.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={admin.role === "owner" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {admin.role.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-lucky-mutedText">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-lucky-mutedText">
                      Initial owner profile is configured during first run.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

