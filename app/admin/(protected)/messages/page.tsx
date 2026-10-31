import React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Trash2, CheckCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminMessagesPage() {
  await requireRole(["owner", "quotation_manager"]);
  const supabase = createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  async function toggleRead(id: string, currentStatus: boolean) {
    "use server";
    await requireRole(["owner", "quotation_manager"]);
    const client = createClient();
    await client
      .from("contact_messages")
      .update({ is_read: !currentStatus })
      .eq("id", id);
    revalidatePath("/admin/messages");
  }

  async function deleteMessage(id: string) {
    "use server";
    await requireRole(["owner", "quotation_manager"]);
    const client = createClient();
    await client.from("contact_messages").delete().eq("id", id);
    revalidatePath("/admin/messages");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-lucky-dark">
          Contact Messages & Inquiries
        </h1>
        <p className="text-sm text-lucky-mutedText">
          Submissions received from prospective partners, distributors, and bulk clients.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inquiries Inbox ({messages?.length || 0})</CardTitle>
          <CardDescription>
            Direct contact form inquiries filtered against spam and honeypots.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition ${
                    msg.is_read
                      ? "border-lucky-borderLight bg-white"
                      : "border-blue-200 bg-blue-50/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lucky-dark text-sm">
                        {msg.name}
                      </span>
                      <span className="text-xs text-lucky-mutedText">
                        • {msg.email}
                      </span>
                      {msg.phone && (
                        <span className="text-xs text-lucky-mutedText">
                          • {msg.phone}
                        </span>
                      )}
                      {!msg.is_read && (
                        <span className="px-2 py-0.5 rounded-full bg-lucky-blue text-white text-[10px] font-bold">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-lucky-mutedText">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-lucky-dark mb-1">
                    Subject: {msg.subject}
                  </h4>
                  <p className="text-xs text-lucky-mutedText leading-relaxed mb-4 bg-slate-50 p-3 rounded-lg border border-lucky-borderLight">
                    {msg.message}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-lucky-borderLight text-xs">
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                        className="inline-flex items-center gap-1 text-lucky-blue font-semibold hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" /> Reply Email
                      </a>
                      {msg.phone && (
                        <a
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <form action={toggleRead.bind(null, msg.id, msg.is_read)}>
                        <Button size="sm" variant="ghost" type="submit" className="text-xs h-7">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          {msg.is_read ? "Mark Unread" : "Mark Read"}
                        </Button>
                      </form>
                      <form action={deleteMessage.bind(null, msg.id)}>
                        <Button
                          size="sm"
                          variant="ghost"
                          type="submit"
                          className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-lucky-mutedText">
              No messages in your inbox. Contact form inquiries will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

