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

### Phase 4 - Phase 9 (Admin, Public, Quotations, Messages, QA, Deployment)
(See `PLAN.md` in root for complete phase details)

