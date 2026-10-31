"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Shirt,
  Sparkles,
  UploadCloud,
  Calendar,
  User,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface QuotationWizardProps {
  availableMaterials: string[];
  prefilledProduct?: { name: string; slug: string } | null;
  prefilledProject?: { title: string; slug: string } | null;
}

export function QuotationWizard({
  availableMaterials,
  prefilledProduct,
  prefilledProject,
}: QuotationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const defaultItem = {
    item_name: prefilledProduct ? prefilledProduct.name : prefilledProject ? `Custom Garment (${prefilledProject.title})` : "Custom Crewneck T-Shirt",
    quantity: 100,
    material: availableMaterials[0] || "100% Combed Cotton",
    sizes_breakdown: { S: 25, M: 50, L: 25 } as Record<string, number>,
    customization_details: "",
  };

  const [formData, setFormData] = useState({
    items: [defaultItem],
    delivery_timeline: "Standard (3-4 weeks)",
    delivery_address: "",
    additional_notes: "",
    contact_name: "",
    company_name: "",
    email: "",
    phone: "",
    website_hp: "",
    attachments: [] as Array<{
      file_path: string;
      file_name: string;
      file_size: number;
      mime_type: string;
    }>,
  });

  // Local storage persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lucky_quote_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore local storage errors
    }
  }, []);

  const saveToLocalStorage = (data: typeof formData) => {
    try {
      localStorage.setItem("lucky_quote_draft", JSON.stringify(data));
    } catch {
      // Ignore
    }
  };

  const updateFormData = (patch: Partial<typeof formData>) => {
    const next = { ...formData, ...patch };
    setFormData(next);
    saveToLocalStorage(next);
  };

  const addItem = () => {
    const nextItems = [
      ...formData.items,
      {
        item_name: "Custom Polo Shirt",
        quantity: 50,
        material: availableMaterials[0] || "100% Combed Cotton",
        sizes_breakdown: { M: 25, L: 25 },
        customization_details: "",
      },
    ];
    updateFormData({ items: nextItems });
  };

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return;
    const nextItems = formData.items.filter((_, i) => i !== index);
    updateFormData({ items: nextItems });
  };

  const updateItem = (index: number, patch: Partial<(typeof formData.items)[0]>) => {
    const nextItems = [...formData.items];
    nextItems[index] = { ...nextItems[index], ...patch };
    updateFormData({ items: nextItems });
  };

  const totalUnits = formData.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  // File Upload Handler (Signed URL flow)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Step 1: Request signed upload URL from backend
        const res = await fetch("/api/upload-signing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Failed to prepare file upload");
          continue;
        }

        const { signedUrl, filePath } = await res.json();

        // Step 2: Upload directly to Supabase private storage via signed URL
        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) {
          alert("File upload to storage failed");
          continue;
        }

        // Add attachment metadata to form state
        const nextAttachments = [
          ...formData.attachments,
          {
            file_path: filePath,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
          },
        ];
        updateFormData({ attachments: nextAttachments });
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload error occurred. Please try again.");
      }
    }
  };

  const removeAttachment = (index: number) => {
    const next = formData.attachments.filter((_, i) => i !== index);
    updateFormData({ attachments: next });
  };

  // Final Form Submission
  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/quote-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: formData.items,
          delivery_timeline: formData.delivery_timeline,
          delivery_address: formData.delivery_address,
          additional_notes: formData.additional_notes,
          contact_name: formData.contact_name,
          company_name: formData.company_name,
          email: formData.email,
          phone: formData.phone,
          honeypot: formData.website_hp,
          attachments: formData.attachments,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Submission failed. Please check form entries.");
      }

      // Success verified by DB write!
      try {
        localStorage.removeItem("lucky_quote_draft");
      } catch {}

      router.push(`/quote/success?ref=${result.reference_number}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setErrorMessage(msg);
      setSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: "Garment Items", icon: Shirt },
    { number: 2, label: "Customization", icon: Sparkles },
    { number: 3, label: "Artwork Files", icon: UploadCloud },
    { number: 4, label: "Timeline & Logistics", icon: Calendar },
    { number: 5, label: "Contact Details", icon: User },
    { number: 6, label: "Review & Submit", icon: CheckCircle2 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left 2 Cols: Form Stepper & Current Step Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Stepper Bar */}
        <div className="bg-white p-4 rounded-2xl border border-lucky-borderLight shadow-sm">
          <div className="grid grid-cols-6 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isDone = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => setCurrentStep(s.number)}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition ${
                    isCurrent
                      ? "bg-lucky-magenta text-white shadow-sm font-bold"
                      : isDone
                      ? "text-lucky-dark bg-lucky-cream font-semibold hover:bg-[#e4d79b]"
                      : "text-lucky-mutedText hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] hidden sm:block truncate w-full">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Garment Items */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Apparel Items & Required Volumes</CardTitle>
              <CardDescription>
                Specify the apparel styles, estimated quantities, and fabric preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-lucky-borderLight bg-slate-50/50 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-sm text-lucky-dark">
                      Item #{idx + 1}
                    </span>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-red-600 hover:text-red-700 p-1 text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                        Garment Description *
                      </label>
                      <input
                        type="text"
                        value={item.item_name}
                        onChange={(e) => updateItem(idx, { item_name: e.target.value })}
                        placeholder="e.g. Classic Pique Polo Shirt"
                        required
                        className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                        Estimated Units *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, { quantity: parseInt(e.target.value) || 0 })}
                        required
                        className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                      Material Specification
                    </label>
                    <select
                      value={item.material}
                      onChange={(e) => updateItem(idx, { material: e.target.value })}
                      className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                    >
                      {availableMaterials.map((mat) => (
                        <option key={mat} value={mat}>
                          {mat}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-lucky-mutedText mt-1 italic">
                      * Fabric options may not all be available depending on mill yarn stock and required dye lots.
                    </p>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Another Apparel Item
              </Button>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setCurrentStep(2)}>
                  Continue to Customization <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Customization */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Customization & Embellishment</CardTitle>
              <CardDescription>
                Describe your desired screen printing, embroidery, woven tags, and placement details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.items.map((item, idx) => (
                <div key={idx} className="space-y-2 p-4 rounded-xl border border-lucky-borderLight">
                  <span className="font-semibold text-xs text-lucky-dark uppercase">
                    Customization for: {item.item_name}
                  </span>
                  <textarea
                    rows={3}
                    value={item.customization_details || ""}
                    onChange={(e) => updateItem(idx, { customization_details: e.target.value })}
                    placeholder="e.g. Left chest 3D embroidery (8cm), large 3-color water-base screen print across back, custom woven neck label."
                    className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                  />
                </div>
              ))}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Continue to Artwork <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Artwork & Design Files */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Artwork & Tech Pack Upload</CardTitle>
              <CardDescription>
                Upload vector logos, mockups, or tech packs (JPG, PNG, WebP, SVG, PDF up to 25MB). Files are securely stored in private storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-lucky-borderLight rounded-2xl p-8 text-center bg-slate-50/50">
                <UploadCloud className="w-10 h-10 text-lucky-blue mx-auto mb-3" />
                <h4 className="font-heading font-bold text-sm text-lucky-dark mb-1">
                  Drag and drop design files here, or browse
                </h4>
                <p className="text-xs text-lucky-mutedText mb-4">
                  Signed uploads directly verify your files before quotation creation.
                </p>
                <label className="inline-flex">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.svg,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="px-4 py-2 rounded-lg bg-lucky-blue text-white text-xs font-semibold cursor-pointer hover:bg-blue-700 transition">
                    Select Artwork Files
                  </span>
                </label>
              </div>

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-lucky-dark block">
                    Attached Files ({formData.attachments.length})
                  </span>
                  <div className="divide-y divide-lucky-borderLight border border-lucky-borderLight rounded-xl overflow-hidden bg-white">
                    {formData.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="p-3 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-lucky-blue shrink-0" />
                          <span className="font-medium text-lucky-dark truncate">
                            {att.file_name}
                          </span>
                          <span className="text-lucky-mutedText">
                            ({(att.file_size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(4)}>
                  Continue to Logistics <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Logistics & Timeline */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Delivery Timeline & Logistics</CardTitle>
              <CardDescription>
                Let us know your target deadline and preferred shipping location.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                  Required Production Timeline *
                </label>
                <select
                  value={formData.delivery_timeline}
                  onChange={(e) => updateFormData({ delivery_timeline: e.target.value })}
                  className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                >
                  <option value="Rush (1-2 weeks)">Rush Production (1-2 weeks)</option>
                  <option value="Standard (3-4 weeks)">Standard Lead Time (3-4 weeks)</option>
                  <option value="Flexible (4-6 weeks)">Flexible Production (4-6 weeks)</option>
                  <option value="Annual Scheduled Run">Annual / Quarterly Scheduled Rollout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                  Delivery Destination / Address (Optional)
                </label>
                <input
                  type="text"
                  value={formData.delivery_address}
                  onChange={(e) => updateFormData({ delivery_address: e.target.value })}
                  placeholder="City, State / Country or Port of Entry"
                  className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                  Special Packaging or Folding Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.additional_notes}
                  onChange={(e) => updateFormData({ additional_notes: e.target.value })}
                  placeholder="e.g. Individual polybagging with size stickers, carton barcoding, or hanger packing."
                  className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(5)}>
                  Continue to Contact Details <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: Contact Information */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Client Contact Information</CardTitle>
              <CardDescription>
                Where should we deliver the official quotation estimate and technical analysis?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => updateFormData({ website_hp: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => updateFormData({ contact_name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => updateFormData({ company_name: e.target.value })}
                    placeholder="Acme Sports Co."
                    className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-lucky-dark mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full p-2.5 text-sm rounded-lg border border-lucky-borderLight bg-white focus:outline-none focus:ring-2 focus:ring-lucky-blue"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  onClick={() => {
                    if (!formData.contact_name || !formData.email || !formData.phone) {
                      setErrorMessage("Please complete all required contact fields.");
                      return;
                    }
                    setErrorMessage("");
                    setCurrentStep(6);
                  }}
                >
                  Review Final Quotation <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 6: Review & Final Submission */}
        {currentStep === 6 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 6: Review & Confirm Request</CardTitle>
              <CardDescription>
                Verify all specifications before final submission. An official reference number will be generated upon confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-lucky-borderLight space-y-4 text-xs">
                <div>
                  <span className="font-bold uppercase text-lucky-dark block mb-1">
                    Apparel Items ({formData.items.length})
                  </span>
                  <div className="space-y-2">
                    {formData.items.map((it, i) => (
                      <div key={i} className="flex justify-between border-b border-lucky-borderLight pb-1">
                        <span className="text-lucky-dark font-medium">
                          {it.item_name} ({it.material})
                        </span>
                        <span className="font-bold font-mono text-lucky-dark">
                          {it.quantity} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between border-t border-lucky-borderLight pt-2">
                  <span className="font-semibold text-lucky-mutedText">Timeline:</span>
                  <span className="font-semibold text-lucky-dark">{formData.delivery_timeline}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-lucky-mutedText">Contact:</span>
                  <span className="font-semibold text-lucky-dark">
                    {formData.contact_name} ({formData.email}, {formData.phone})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold text-lucky-mutedText">Attachments:</span>
                  <span className="font-semibold text-lucky-dark">
                    {formData.attachments.length} file(s) uploaded
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(5)} disabled={submitting}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Edit Details
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-lucky-magenta hover:bg-[#731f64] text-white font-bold px-8 shadow-sm"
                >
                  {submitting ? "Writing to Database..." : "Submit Quotation Request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column: Sticky Summary Panel */}
      <div className="sticky top-24 space-y-4">
        <Card className="shadow-sm border-lucky-borderLight">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-heading">
              Quotation Summary
            </CardTitle>
            <CardDescription className="text-xs">
              Live specification preview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-lucky-borderLight">
              <span className="text-lucky-mutedText">Total Items</span>
              <span className="font-bold text-lucky-dark">{formData.items.length} line(s)</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-lucky-borderLight">
              <span className="text-lucky-mutedText">Total Units</span>
              <span className="font-bold font-mono text-base text-lucky-blue">
                {totalUnits} pcs
              </span>
            </div>

            <div className="py-2 border-b border-lucky-borderLight">
              <span className="text-lucky-mutedText block mb-1">Target Lead Time</span>
              <span className="font-semibold text-lucky-dark">{formData.delivery_timeline}</span>
            </div>

            {formData.contact_name && (
              <div className="py-2 border-b border-lucky-borderLight">
                <span className="text-lucky-mutedText block mb-1">Requested For</span>
                <span className="font-semibold text-lucky-dark">{formData.contact_name}</span>
                {formData.company_name && (
                  <span className="text-lucky-mutedText block">{formData.company_name}</span>
                )}
              </div>
            )}

            <div className="p-3 rounded-lg bg-lucky-lightNeutral text-[11px] text-lucky-mutedText leading-relaxed">
              Lucky Fashion prepares formal quotations with volume breakdown discounts. There is no checkout or upfront payment.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

