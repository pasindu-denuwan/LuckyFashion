# Lucky Fashion: Implementation Plan for Antigravity

## 1. Key Decisions

| Area | Choice | Reason |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SEO, server rendering, ISR/revalidation, server actions that keep secrets off the client |
| Styling | Tailwind CSS + shadcn/ui (Radix) | Accessible primitives for modals, dropdowns and tables |
| Animation | Motion (Framer Motion) | Hero, scroll reveals and page transitions, with `prefers-reduced-motion` support |
| Forms | React Hook Form + Zod | The same Zod schemas validate on client and server |
| Backend | **Supabase** (Postgres, Auth, Storage, RLS) | Covers the database, auth and storage in the spec |
| Email | Resend (optional, off until configured) | Admin alerts and customer acknowledgment |
| Anti-spam | Cloudflare Turnstile + honeypot + rate limit | Protects the quotation and contact forms |
| Charts | Recharts | Dashboard analytics |
| Hosting | Vercel | Preview deploys, env vars and on-demand revalidation |

### Rules in `AGENTS.md`
- No shopping cart, prices or checkout. CTAs say "Request a Quote".
- No frocks, skirts or dresses anywhere, including seed data.
- Never invent company facts (founding year, certifications, capacity, MOQ, testimonials). Unknown values come from `business_settings` or `website_content`, with graceful empty fallbacks.
- Secrets live only in env vars. The service-role key is server-only and never imported in client code.
- Every demo record carries an `is_demo` flag and a visible "Sample" label.
- Quotation success UI appears only after the DB confirms the save.

---

## 2. Repository Structure

```
/app
  (public)/            home, about, products, products/[slug], our-work,
                       our-work/[slug], manufacturing, quote, quote/success,
                       contact, privacy, not-found
  (admin)/admin/       login, (protected)/ overview, quotations, products,
                       categories, completed-orders, media, content, messages,
                       notifications, business, settings
  api/                 upload-signing, revalidate, quote-submit, contact-submit
/components
  ui/ public/ admin/ forms/ gallery/
/lib
  supabase/ (server.ts, client.ts, admin.ts)
  validators/ (zod schemas)
  auth/ (requireRole)
  revalidate.ts, seo.ts, rate-limit.ts, storage.ts
/supabase
  migrations/ seed.sql policies.sql
/docs
  PLAN.md  SECURITY.md  GO-LIVE-CHECKLIST.md
```

---

## 3. Phased Build Plan

### Phase 0: Foundation
- Scaffold Next.js, Tailwind, shadcn, ESLint, Prettier and Vitest/Playwright.
- Write the rules file (`AGENTS.md`) and `PLAN.md`.
- Create the Supabase project configuration and `.env.example` with placeholder keys only.
- Load the fonts: Space Grotesk (headings) and Manrope (body), via `next/font`.
- **Done when:** the app runs, lint passes and no secrets are committed.

### Phase 1: Design System
- Define tokens from palette: `#17191D`, `#242830`, `#F8F8F6`, `#2563EB`, `#ECEEF1`, `#6B7280`, `#E5E7EB` and the status colors.
- Build the type scale, radii, shadows and focus ring.
- Build the shared components: Button, Card, Badge, Modal, Toast, Accordion, EmptyState, Skeleton, StatusBadge, and an Image component with lazy loading and blur placeholders.
- Build a `/design-system` route (dev only) showing all components.
- **Done when:** components pass contrast checks and keyboard navigation, and reduced-motion is honored.

### Phase 2: Database, RLS and Storage
- Write migrations for every table:
  - `publication_status` enum (`draft`, `published`, `archived`)
  - `quotation_status` enum (`new`, `in_review`, `estimated`, `approved`, `rejected`, `archived`)
  - `admin_role` enum (`owner`, `content_manager`, `quotation_manager`)
  - Tables: `categories`, `products`, `product_images`, `completed_orders`, `completed_order_images`, `quotations`, `quotation_items`, `quotation_attachments`, `contact_messages`, `admin_profiles`, `business_settings`, `website_content`, `audit_logs`, `notifications`, `internal_notes`.
- Add indexes on `slug`, `status`, `category_id`, `created_at` and `reference_number`.
- **Quotation reference:** a `quotation_counters(year, last_value)` table plus a Postgres function `next_quotation_ref()` that does an atomic upsert-increment and returns `LF-Q-2026-0001`. This guarantees uniqueness under concurrency.
- **Slugs:** a DB function or trigger that generates unique slugs and appends a suffix on collision.
- **RLS policies:**
  - Anonymous users can `SELECT` only `status='published'` products, projects and active categories, plus public settings and content.
  - Anonymous users can never read the quotation, message, note, notification or audit tables.
  - Admin roles are checked through `admin_profiles`. Owner has full access, Content Manager has content and media, and Quotation Manager has quotations and messages.
- **Storage buckets:**
  - `public-media`: public-read, admin-write, holds approved website images.
  - `quotation-private`: private, accessed only through server-issued signed URLs.
- Add a seed script with clearly labeled demo categories, products and projects (`is_demo = true`).
- **Done when:** an RLS test suite proves an anonymous client cannot read private tables or the private bucket, and a Content Manager cannot read quotations.

### Phase 3: Auth and Admin Shell
- Build `/admin/login` with Supabase Auth, password reset, loading and error states.
- Add middleware plus a server-side `requireRole()` check on every admin page and action. Hiding navigation is not security.
- Build the sidebar (collapsible, tooltips, mobile drawer), topbar, and profile dropdown with logout.
- Write audit-log helpers for admin mutations.
- **Done when:** unauthenticated users are redirected, wrong-role users get 403, and sessions expire correctly.

### Phase 4: Admin Content Modules
1. **Media Library:** Drag-and-drop multi-upload with progress, validation (JPG/PNG/WebP, size and dimensions), image optimization into responsive variants, and rename, alt text and caption editing. Block deleting media that is still referenced. Include a reusable **MediaPicker** used by every other form.
2. **Categories:** CRUD, reorder, enable/disable. Block deletion when products exist and offer reassign or archive.
3. **Products:** Table with search, filter and sort, plus the form (draft, preview, publish) with image reordering and a cover image. Duplicate, archive and confirm-delete.
4. **Completed Orders (portfolio):** The same pattern as products, plus the **"Permission to publish applicable customer materials has been confirmed"** checkbox. Publishing is blocked until it is ticked whenever the project is marked as containing customer-identifying material. Keep the data fully separate from quotations.
5. **Website Content:** A JSON-driven section editor per page (Home, About, Manufacturing, Contact, Footer) with draft, preview and publish, an unsaved-changes guard, and Zod schemas per section.
6. **Business Information:** Settings form for phone, WhatsApp, email, address, hours and socials.
- After each successful publish or save, call `revalidateTag()` or `revalidatePath()` so the public site updates without code changes.

### Phase 5: Public Website
- Header (sticky, scroll transition, category dropdown, mobile overlay), footer, and home page with all sections.
- Home sections pull categories, featured published projects and CMS content. Show elegant empty states when data is missing.
- About, Manufacturing (with FAQ accordion), Contact, Privacy placeholder and custom 404.
- Products: search and filters, grid, detail page with thumbnail gallery, zoom and related products.
- Our Work: filters, search, masonry/editorial grid, lightbox, and detail pages with related projects. Unpublished items return 404.
- "Request Quote" passes `?product=slug` or `?project=slug`, prefilling the form without exposing private order data.
- SEO: `generateMetadata`, Open Graph, JSON-LD (Organization, and Product only where accurate), `sitemap.ts` and `robots.ts`.

### Phase 6: Quotation System
- 6-step form with sticky summary, progress stepper, and multi-item support (field array where each item has quantity, sizes, material and customization).
- Persist draft state locally so edits across steps never lose data.
- Material options come from `business_settings`, UI indicates "options may not all be available".
- **Uploader:** drag-and-drop, preview, progress, retry and remove, with type and size validation:
  1. Server validates request and issues signed upload URLs into private bucket.
  2. Client uploads the files.
  3. Finalize server action re-validates file metadata, writes quotation and items, calls `next_quotation_ref()`, and writes attachment records.
  4. Only then does client receive reference number and redirect to success page.
- Server-side Zod validation, Turnstile verification and IP rate limiting.
- Notification row created for admins on submit. Emails sent only if Resend key is configured, otherwise skipped and logged.
- Admin side: table with filters and search, detail view, status updates, internal notes, signed-URL attachment downloads, CSV export, copy-email and WhatsApp deep links. No automatic pricing.

### Phase 7: Messages, Notifications and Overview
- Contact form saves to `contact_messages` with spam protection. Admin inbox supports read/unread, archive, delete, notes and email/WhatsApp shortcuts.
- Notification dropdown with unread count, mark-as-read and history page.
- Overview cards, recent tables, quick actions and three charts, all from live queries with empty states. Demo data is labeled.

### Phase 8: Quality Pass
- **Accessibility (WCAG 2.2 AA):** axe checks, focus management in modals, form labels and errors announced to screen readers.
- **Performance:** `next/image`, code-split admin and public bundles, Lighthouse checks.
- **Responsive QA:** at 1440, 1280, 1024, 768, 390 and 320px. Admin tables turn into cards on narrow screens.
- **Security review:** pen-test checklist against `SECURITY.md`, file upload abuse cases, and service-key leakage scan.

### Phase 9: Deployment
- Deploy to Vercel, connect Supabase production project and configure env vars.
- Run migrations, create the first Owner admin manually, and configure auth redirect URLs.
- Complete `GO-LIVE-CHECKLIST.md`.

---

## 4. Automated Test Coverage
- **Unit:** Zod schemas, slug generation and reference-number format.
- **RLS tests:** public vs. each admin role, for every table and bucket.
- **E2E (Playwright):**
  - Workflow A: add and publish a product, verify on public site.
  - Workflow B: publish a project, verify Our Work & featured section, verify 404 after unpublishing.
  - Workflow C: submit quotation, verify in admin, download attachment, change status.
  - Workflow D: edit homepage content and verify public page updates.
  - Workflow E: change phone number and verify across header, footer, contact.

