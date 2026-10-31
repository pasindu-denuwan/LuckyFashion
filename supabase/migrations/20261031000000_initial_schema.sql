-- Lucky Fashion Initial Database Schema
-- Compatible with Supabase Postgres

-- 1. Create Enums
DO $$ BEGIN
  CREATE TYPE publication_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE quotation_status AS ENUM ('new', 'in_review', 'estimated', 'approved', 'rejected', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('owner', 'content_manager', 'quotation_manager');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Admin Profiles Table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'quotation_manager',
  full_name text,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Products Table
-- Strictly NO frocks, skirts, or dresses per AGENTS.md
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  fabric_details text,
  available_colors text[] DEFAULT '{}',
  available_sizes text[] DEFAULT '{}',
  status publication_status NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  cover_image_url text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 6. Completed Orders Table (Portfolio / Our Work)
CREATE TABLE IF NOT EXISTS completed_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client_type text,
  description text,
  specifications jsonb DEFAULT '{}'::jsonb,
  status publication_status NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  customer_material_permission boolean NOT NULL DEFAULT false,
  has_customer_identifying_material boolean NOT NULL DEFAULT false,
  cover_image_url text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT check_permission_for_customer_materials CHECK (
    (has_customer_identifying_material = false) OR 
    (has_customer_identifying_material = true AND (status = 'draft' OR customer_material_permission = true))
  )
);

-- 7. Completed Order Images Table
CREATE TABLE IF NOT EXISTS completed_order_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES completed_orders(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 8. Quotation Counters Table (Atomic Sequencer)
CREATE TABLE IF NOT EXISTS quotation_counters (
  year integer PRIMARY KEY,
  last_value integer NOT NULL DEFAULT 0
);

-- 9. Atomic Quotation Reference Generation Function
CREATE OR REPLACE FUNCTION next_quotation_ref()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_year integer := EXTRACT(YEAR FROM CURRENT_DATE);
  new_val integer;
BEGIN
  INSERT INTO quotation_counters (year, last_value)
  VALUES (current_year, 1)
  ON CONFLICT (year)
  DO UPDATE SET last_value = quotation_counters.last_value + 1
  RETURNING last_value INTO new_val;

  RETURN 'LF-Q-' || current_year || '-' || LPAD(new_val::text, 4, '0');
END;
$$;

-- 10. Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text NOT NULL UNIQUE,
  status quotation_status NOT NULL DEFAULT 'new',
  contact_name text NOT NULL,
  company_name text,
  email text NOT NULL,
  phone text NOT NULL,
  delivery_timeline text,
  delivery_address text,
  additional_notes text,
  estimated_amount numeric(12,2),
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11. Quotation Items Table
CREATE TABLE IF NOT EXISTS quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  material text,
  sizes_breakdown jsonb DEFAULT '{}'::jsonb,
  customization_details text,
  created_at timestamptz DEFAULT now()
);

-- 12. Quotation Attachments Table
CREATE TABLE IF NOT EXISTS quotation_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 13. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- 14. Internal Notes Table
CREATE TABLE IF NOT EXISTS internal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 15. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'quotation_received',
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 16. Business Settings Table
CREATE TABLE IF NOT EXISTS business_settings (
  id text PRIMARY KEY DEFAULT 'default',
  company_name text NOT NULL DEFAULT 'Lucky Fashion',
  phone text,
  whatsapp text,
  email text,
  address text,
  business_hours text,
  social_links jsonb DEFAULT '{}'::jsonb,
  available_materials text[] DEFAULT '{"100% Combed Cotton", "Cotton-Polyester Blend", "Dry-Fit Polyester", "Single Jersey", "Pique Cotton", "Heavyweight Fleece"}',
  updated_at timestamptz DEFAULT now()
);

-- 17. Website Content Table
CREATE TABLE IF NOT EXISTS website_content (
  page_key text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- 18. Media Library Table
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path text NOT NULL UNIQUE,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  width integer,
  height integer,
  alt_text text,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- 19. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 20. Indexes for Fast Lookups and Filters
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_completed_orders_slug ON completed_orders(slug);
CREATE INDEX IF NOT EXISTS idx_completed_orders_status ON completed_orders(status);
CREATE INDEX IF NOT EXISTS idx_completed_orders_category_id ON completed_orders(category_id);
CREATE INDEX IF NOT EXISTS idx_completed_orders_created_at ON completed_orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quotations_reference ON quotations(reference_number);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_internal_notes_entity ON internal_notes(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read, created_at DESC);

