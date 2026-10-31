# Go-Live Checklist: Lucky Fashion

Before releasing to production, verify each item on this checklist:

## 1. Secrets & Credentials
- [ ] Supabase production project created.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured in Vercel environment variables.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set strictly in server-side Vercel environment variables.
- [ ] Cloudflare Turnstile Site Key & Secret Key configured.
- [ ] Resend API Key configured (and verified domain set in `RESEND_FROM_EMAIL`).

## 2. Database & Storage
- [ ] Migrations applied to production Supabase Postgres database.
- [ ] RLS policies confirmed active on all tables.
- [ ] `quotation_counters` initialized for current year (e.g., 2026).
- [ ] `public-media` and `quotation-private` buckets created with proper RLS and CORS rules.
- [ ] Initial Owner admin profile created manually via Supabase Auth + `admin_profiles` insert.

## 3. Data Integrity & Company Facts
- [ ] Real business info entered in `business_settings` (phone, WhatsApp, email, physical address, business hours).
- [ ] Accurate `website_content` entered for all pages (Home, About, Manufacturing, Contact, Footer).
- [ ] Remove or archive any placeholder demo data (`is_demo = true`).
- [ ] Verify no forbidden categories (no frocks, skirts, or dresses) exist anywhere in catalog or tags.
- [ ] Privacy Policy reviewed and updated for business compliance.

## 4. Verification & Testing
- [ ] Test public quotation submission flow end-to-end:
  - File upload generates signed URL into `quotation-private`.
  - Database stores quotation and items atomically.
  - Client receives valid reference number format (`LF-Q-YYYY-XXXX`).
  - Admin receives notification in dashboard.
- [ ] Test contact form submission and spam protection.
- [ ] Verify admin role enforcement (Owner vs Content Manager vs Quotation Manager).
- [ ] Verify that no shopping carts, checkout buttons, or prices appear on the site.
- [ ] Audit Lighthouse performance and WCAG AA accessibility compliance.

