# Security Policy & Architecture

## Security Principles for Lucky Fashion

### 1. Zero Trust Environment Secrets
- Secrets must never be committed to Git or exposed to the client bundle.
- `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to server actions, API route handlers, and backend scripts (`lib/supabase/admin.ts`).
- Public client bundle interacts with Supabase exclusively via `NEXT_PUBLIC_SUPABASE_ANON_KEY` through strict Row Level Security (RLS) policies.

### 2. Row Level Security (RLS) Policy
- All tables must have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
- Anonymous / Public users:
  - Can only `SELECT` records where `status = 'published'` for `products`, `completed_orders`, and `categories`.
  - Can read public business settings and approved `website_content`.
  - Cannot read `quotations`, `quotation_items`, `quotation_attachments`, `contact_messages`, `admin_profiles`, `audit_logs`, or `internal_notes`.
- Storage:
  - `public-media`: Public read; write restricted to authenticated admin users with role `owner` or `content_manager`.
  - `quotation-private`: No public read access. Only accessible via server-generated signed URLs.

### 3. Admin Authentication & Role Enforcement
- Admin routes (`/admin/*`) are guarded by Next.js Edge Middleware and server-side `requireRole()` checks in page layouts and server actions.
- Role matrix:
  - `owner`: Full privileges across settings, content, media, products, completed orders, quotations, messages, user management.
  - `content_manager`: Manage products, categories, completed orders, media library, and website content. No quotation or financial/customer message access.
  - `quotation_manager`: Review, update, and manage incoming quotations, customer contact messages, and related notes.

### 4. Input Validation & Spam Protection
- All forms (Quotation, Contact, Newsletter/Inquiry) are validated using shared Zod schemas.
- Submissions are defended by:
  - Cloudflare Turnstile token validation on server actions.
  - Invisible honeypot field.
  - In-memory / Upstash rate limiting by IP.

### 5. File Upload Verification
- Uploads are accepted only for allowed MIME types (e.g., `image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
- File size caps strictly enforced on client and server.
- Sanitized filenames to avoid path traversal and malicious executable storage.

