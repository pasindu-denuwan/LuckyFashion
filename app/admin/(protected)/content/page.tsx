import React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  await requireRole(["owner", "content_manager"]);
  const activePage = searchParams.page || "home";
  const supabase = createClient();

  const { data: pageRecord } = await supabase
    .from("website_content")
    .select("*")
    .eq("page_key", activePage)
    .single();

  const content = pageRecord?.content || {};

  async function saveContent(formData: FormData) {
    "use server";
    await requireRole(["owner", "content_manager"]);

    const page_key = formData.get("page_key") as string;
    const rawJson = formData.get("content_json") as string;

    try {
      const parsedContent = JSON.parse(rawJson);
      const client = createClient();
      await client.from("website_content").upsert({
        page_key,
        content: parsedContent,
        updated_at: new Date().toISOString(),
      });

      revalidatePath(`/${page_key === "home" ? "" : page_key}`);
      revalidatePath("/admin/content");
    } catch (err) {
      console.error("Invalid JSON content:", err);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold font-heading text-lucky-dark">
          Website Content Management
        </h1>
        <p className="text-sm text-lucky-mutedText">
          Edit headlines, mission statements, manufacturing FAQs, and copy across the public site.
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 border-b border-lucky-borderLight pb-3">
        {["home", "about", "manufacturing", "contact"].map((page) => (
          <a
            key={page}
            href={`/admin/content?page=${page}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
              activePage === page
                ? "bg-lucky-blue text-white"
                : "bg-white text-lucky-dark border border-lucky-borderLight hover:bg-slate-50"
            }`}
          >
            {page} Page
          </a>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{activePage} Page Copy</CardTitle>
          <CardDescription>
            Direct structured JSON editor powering section content. Validated upon submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveContent} className="space-y-4">
            <input type="hidden" name="page_key" value={activePage} />
            <div>
              <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                Content Data (JSON format)
              </label>
              <textarea
                name="content_json"
                defaultValue={JSON.stringify(content, null, 2)}
                rows={16}
                required
                className="w-full font-mono text-xs p-4 rounded-lg border border-lucky-borderLight bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-lucky-blue"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="submit" variant="default">
                Save & Revalidate Page
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

