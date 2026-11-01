import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle, Sparkles } from "lucide-react";
import { contactMessageSchema } from "@/lib/validators/contact";
import { revalidatePath } from "next/cache";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const supabase = createClient();

  const { data: settings } = await supabase
    .from("business_settings")
    .select("*")
    .eq("id", "default")
    .single();

  const phone = settings?.phone || "+1 (555) 019-2834";
  const whatsapp = settings?.whatsapp;
  const email = settings?.email || "inquiries@luckyfashion.com";
  const address = settings?.address || "100 Industrial Parkway, Garment District";
  const hours = settings?.business_hours || "Mon - Fri: 8:30 AM - 6:00 PM";

  async function submitContactMessage(formData: FormData) {
    "use server";

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      subject: formData.get("subject"),
      message: formData.get("message"),
      honeypot: formData.get("website_hp") || "",
    };

    const parseResult = contactMessageSchema.safeParse(rawData);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error.flatten());
      return;
    }

    const { name, email, phone, subject, message } = parseResult.data;
    const client = createClient();

    // 1. Insert into contact_messages
    const { error: insertError } = await client
      .from("contact_messages")
      .insert({
        name,
        email,
        phone,
        subject,
        message,
      });

    if (insertError) {
      console.error("Failed to insert contact message:", insertError);
      return;
    }

    // 2. Insert admin notification
    await client.from("notifications").insert({
      title: `New Inquiry from ${name}`,
      message: `Subject: ${subject}`,
      type: "contact_received",
      link: "/admin/messages",
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin/overview");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="rounded-3xl bg-gradient-to-r from-lucky-dark to-lucky-darkCard p-8 sm:p-14 text-white relative overflow-hidden shadow-lg border border-purple-900/60">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lucky-cream/20 text-lucky-cream text-xs font-bold border border-lucky-cream/30">
            <Sparkles className="w-3.5 h-3.5 text-lucky-cream" />
            <span>Direct Communication</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            Contact Factory Operations & Sales
          </h1>
          <p className="text-sm sm:text-base text-purple-200 leading-relaxed">
            Reach our production specialists for custom apparel inquiries, technical tech-pack discussions, or factory facility visits.
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-lucky-magenta/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="shadow-sm border-lucky-borderLight">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-bold font-heading text-lucky-dark">
                Send Us a Direct Message
              </CardTitle>
              <CardDescription className="text-xs text-lucky-mutedText">
                Complete the fields below and an apparel production coordinator will follow up within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              {searchParams.success && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Your message has been sent successfully. Our team will reply shortly.</span>
                </div>
              )}

              <form action={submitContactMessage} className="space-y-4">
                {/* Honeypot field - invisible to human users */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_hp">Leave empty</label>
                  <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className="w-full p-2.5 text-xs rounded-xl border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-magenta"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full p-2.5 text-xs rounded-xl border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-magenta"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      className="w-full p-2.5 text-xs rounded-xl border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-magenta"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-1.5">
                      Inquiry Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      placeholder="Custom batch question or timeline"
                      className="w-full p-2.5 text-xs rounded-xl border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-magenta"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-lucky-dark mb-1.5">
                    Your Message / Specifications *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Provide details about your target garments, required turnaround, or inquiry..."
                    className="w-full p-3 text-xs rounded-xl border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-magenta"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="default" size="lg" className="w-full sm:w-auto shadow-md">
                    Send Inquiry
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Factory Information (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-7 space-y-6 shadow-sm border-lucky-borderLight">
            <h3 className="text-xl font-bold font-heading text-lucky-dark">
              Factory & Showroom
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-lucky-dark block mb-0.5">Physical Address</span>
                  <span className="text-lucky-mutedText leading-relaxed">{address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-lucky-dark block mb-0.5">Phone Contact</span>
                  <span className="text-lucky-mutedText">{phone}</span>
                </div>
              </div>

              {whatsapp && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-lucky-dark block mb-0.5">WhatsApp Desk</span>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lucky-magenta font-bold hover:underline"
                    >
                      Chat with Production Team ↗
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-lucky-dark block mb-0.5">Email Support</span>
                  <span className="text-lucky-mutedText">{email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-lucky-magenta shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-lucky-dark block mb-0.5">Operating Hours</span>
                  <span className="text-lucky-mutedText">{hours}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
