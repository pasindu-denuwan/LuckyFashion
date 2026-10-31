import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminNotificationsPage() {
  const supabase = createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  async function markAllAsRead() {
    "use server";
    const client = createClient();
    await client.from("notifications").update({ is_read: true }).eq("is_read", false);
    revalidatePath("/admin/notifications");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">
            System Notifications
          </h1>
          <p className="text-sm text-lucky-mutedText">
            Real-time activity alerts for new quotation submissions and customer inquiries.
          </p>
        </div>
        <form action={markAllAsRead}>
          <Button size="sm" variant="outline" type="submit">
            <Check className="w-4 h-4 mr-1" /> Mark All as Read
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>
            Recent automated triggers and production events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications && notifications.length > 0 ? (
            <div className="divide-y divide-lucky-borderLight">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`py-4 flex items-start justify-between gap-4 transition ${
                    !n.is_read ? "bg-blue-50/20 -mx-4 px-4 rounded-lg" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        !n.is_read
                          ? "bg-lucky-blue text-white"
                          : "bg-lucky-lightNeutral text-lucky-mutedText"
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-lucky-dark">
                        {n.title}
                      </h4>
                      <p className="text-xs text-lucky-mutedText mt-0.5">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-lucky-mutedText block mt-1">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {n.link && (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={n.link} className="text-xs flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-lucky-mutedText">
              No notifications yet. You will be alerted when new quotes or messages arrive.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

