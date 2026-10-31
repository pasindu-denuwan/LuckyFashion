# Agent Rules for Lucky Fashion

These rules apply to all AI agents and developers working on the Lucky Fashion codebase. Every agent must strictly adhere to these instructions.

## 1. Core Business Rules
- **No Shopping Cart, Prices, or Checkout**: Lucky Fashion is a B2B custom apparel manufacturer. There are no online prices, shopping carts, or checkout flows. All primary CTAs must say **"Request a Quote"** (or "Request Custom Quotation").
- **Strict Product Categories (No Frocks, Skirts, or Dresses)**: Absolutely no frocks, skirts, or dresses anywhere in the system, UI, seed data, mock fixtures, or test cases.
- **Never Fabricate Company Facts**: Never invent founding years, certifications (e.g. ISO/WRAP), factory capacities, minimum order quantities (MOQ), or client testimonials. All such facts must originate from `business_settings` or `website_content` tables in the database, with graceful empty fallbacks when values are unset.
- **Demo Data Transparency**: Every demo or seeded record must carry an `is_demo: true` flag. The UI must always display a visible "Sample" tag or badge whenever demo data is rendered.
- **Verified Quotation Submission**: The quotation success screen must appear ONLY after the database confirms the save and returns a unique reference number. Never fake backend success states or use optimistic redirect shortcuts without verified DB persistence.

## 2. Security & Environment Rules
- **Secrets Management**: Secrets live exclusively in environment variables.
- **Server-Only Service Role Key**: `SUPABASE_SERVICE_ROLE_KEY` is server-only (`lib/supabase/admin.ts`). Never import it into client-side components or expose it to browser bundles.
- **Role-Based Access Control**: Middleware and server-side `requireRole()` checks must protect all admin routes and actions. Merely hiding navigation elements is not security.
- **Storage Isolation**:
  - `public-media`: Public read, authenticated admin write.
  - `quotation-private`: Strictly private. Uploaded files and attachments can only be accessed via time-limited server-generated signed URLs.

## 3. Implementation Standards
- Follow the phased blueprint in `PLAN.md`.
- Maintain full TypeScript safety with strict types.
- Validate on both client and server using shared Zod schemas (`lib/validators/`).
- Support `prefers-reduced-motion` across all animations (Framer Motion).
- Comply with WCAG 2.2 AA accessibility guidelines (focus management, keyboard navigability, semantic tags, screen-reader error announcements).

