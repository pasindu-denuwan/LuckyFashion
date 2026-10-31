import React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function AdminBusinessSettingsPage() {
  await requireRole(["owner"]);
  const supabase = createClient();

  const { data: settings } = await supabase
    .from("business_settings")
    .select("*")
    .eq("id", "default")
    .single();

  async function updateSettings(formData: FormData) {
    "use server";
    await requireRole(["owner"]);

    const company_name = formData.get("company_name") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const business_hours = formData.get("business_hours") as string;

    const client = createClient();
    await client
      .from("business_settings")
      .upsert({
        id: "default",
        company_name,
        phone,
        whatsapp,
        email,
        address,
        business_hours,
        updated_at: new Date().toISOString(),
      });

    revalidatePath("/admin/business");
    revalidatePath("/", "layout");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-heading text-lucky-dark">
          Business Information
        </h1>
        <p className="text-sm text-lucky-mutedText">
          Official contact numbers, WhatsApp channel, physical address, and operating hours.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company & Contact Profiles</CardTitle>
          <CardDescription>
            Changes saved here immediately update the website header, footer, and contact page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateSettings} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  defaultValue={settings?.company_name || "Lucky Fashion"}
                  required
                  className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                  Primary Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={settings?.email || ""}
                  placeholder="inquiries@luckyfashion.com"
                  className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={settings?.phone || ""}
                  placeholder="+1 (555) 019-2834"
                  className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                  WhatsApp Direct Number
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  defaultValue={settings?.whatsapp || ""}
                  placeholder="+15550192834"
                  className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                Factory & Showroom Physical Address
              </label>
              <input
                type="text"
                name="address"
                defaultValue={settings?.address || ""}
                placeholder="100 Industrial Parkway, Garment District"
                className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                Production & Office Hours
              </label>
              <input
                type="text"
                name="business_hours"
                defaultValue={settings?.business_hours || ""}
                placeholder="Mon - Fri: 8:30 AM - 6:00 PM"
                className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="default">
                Save Business Information
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

