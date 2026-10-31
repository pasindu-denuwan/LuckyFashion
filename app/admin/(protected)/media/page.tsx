import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { UploadCloud, Image as ImageIcon, Trash2 } from "lucide-react";

export default async function AdminMediaPage() {
  const supabase = createClient();

  const { data: mediaItems } = await supabase
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-lucky-dark">
            Media Library
          </h1>
          <p className="text-sm text-lucky-mutedText">
            Approved photography, garment swatches, and factory assets stored in public-media storage.
          </p>
        </div>
        <Button size="sm" variant="default">
          <UploadCloud className="w-4 h-4 mr-1" /> Upload Assets
        </Button>
      </div>

      {/* Upload Zone */}
      <Card className="border-dashed border-2 bg-slate-50/50 text-center p-8">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-lucky-lightNeutral flex items-center justify-center text-lucky-dark mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-lucky-dark mb-1">
            Drag & Drop Media Assets Here
          </h3>
          <p className="text-xs text-lucky-mutedText mb-4">
            Supports JPG, PNG, and WebP up to 10MB. Images are optimized for high-density displays.
          </p>
          <Button size="sm" variant="outline">
            Browse Files
          </Button>
        </div>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Asset Library ({mediaItems?.length || 0})</CardTitle>
          <CardDescription>
            Images available for selection across products, categories, and portfolio items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mediaItems && mediaItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl border border-lucky-borderLight overflow-hidden bg-white hover:shadow-md transition"
                >
                  <OptimizedImage
                    src={item.file_path}
                    alt={item.alt_text || item.file_name}
                    width={200}
                    height={160}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-2 text-xs truncate">
                    <p className="font-semibold text-lucky-dark truncate">
                      {item.file_name}
                    </p>
                    <span className="text-[10px] text-lucky-mutedText">
                      {(item.file_size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-lucky-mutedText">
              <ImageIcon className="w-8 h-8 opacity-30 mx-auto mb-2" />
              No uploaded media assets yet. Use the upload zone above to add your first asset.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

