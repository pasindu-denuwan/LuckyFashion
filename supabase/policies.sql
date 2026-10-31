-- Row Level Security (RLS) Policies for Lucky Fashion
-- Reference copy of 20261031000001_rls_policies.sql

CREATE OR REPLACE FUNCTION current_admin_role()
RETURNS admin_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM admin_profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (current_admin_role() = 'owner');
$$;

CREATE OR REPLACE FUNCTION can_manage_content()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (current_admin_role() IN ('owner', 'content_manager'));
$$;

CREATE OR REPLACE FUNCTION can_manage_quotations()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (current_admin_role() IN ('owner', 'quotation_manager'));
$$;

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_order_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_owner());

CREATE POLICY "Owners can manage admin profiles"
  ON admin_profiles FOR ALL
  TO authenticated
  USING (is_owner())
  WITH CHECK (is_owner());

CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Content managers can view all categories"
  ON categories FOR SELECT
  TO authenticated
  USING (can_manage_content());

CREATE POLICY "Content managers can insert/update/delete categories"
  ON categories FOR ALL
  TO authenticated
  USING (can_manage_content())
  WITH CHECK (can_manage_content());

CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Content managers can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (can_manage_content());

CREATE POLICY "Content managers can modify products"
  ON products FOR ALL
  TO authenticated
  USING (can_manage_content())
  WITH CHECK (can_manage_content());

CREATE POLICY "Public can view published product images"
  ON product_images FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM products p WHERE p.id = product_images.product_id AND p.status = 'published'
  ));

CREATE POLICY "Content managers can modify product images"
  ON product_images FOR ALL
  TO authenticated
  USING (can_manage_content())
  WITH CHECK (can_manage_content());

CREATE POLICY "Public can view published completed orders"
  ON completed_orders FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Content managers can view all completed orders"
  ON completed_orders FOR SELECT
  TO authenticated
  USING (can_manage_content());

CREATE POLICY "Content managers can modify completed orders"
  ON completed_orders FOR ALL
  TO authenticated
  USING (can_manage_content())
  WITH CHECK (can_manage_content());

CREATE POLICY "Public can view published completed order images"
  ON completed_order_images FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM completed_orders co WHERE co.id = completed_order_images.order_id AND co.status = 'published'
  ));

CREATE POLICY "Content managers can modify completed order images"
  ON completed_order_images FOR ALL
  TO authenticated
  USING (can_manage_content())
  WITH CHECK (can_manage_content());

CREATE POLICY "Quotation managers can view quotations"
  ON quotations FOR SELECT
  TO authenticated
  USING (can_manage_quotations());

CREATE POLICY "Quotation managers can update quotations"
  ON quotations FOR UPDATE
  TO authenticated
  USING (can_manage_quotations())
  WITH CHECK (can_manage_quotations());

CREATE POLICY "Quotation managers can view quotation items"
  ON quotation_items FOR SELECT
  TO authenticated
  USING (can_manage_quotations());

CREATE POLICY "Quotation managers can view quotation attachments"
  ON quotation_attachments FOR SELECT
  TO authenticated
  USING (can_manage_quotations());

CREATE POLICY "Quotation managers can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (can_manage_quotations());

CREATE POLICY "Quotation managers can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (can_manage_quotations())
  WITH CHECK (can_manage_quotations());

CREATE POLICY "Quotation managers can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (can_manage_quotations());

CREATE POLICY "Admins can view internal notes for their domain"
  ON internal_notes FOR SELECT
  TO authenticated
  USING (
    is_owner() OR
    (entity_type = 'quotation' AND can_manage_quotations()) OR
    (entity_type = 'contact_message' AND can_manage_quotations()) OR
    (entity_type = 'completed_order' AND can_manage_content())
  );

CREATE POLICY "Admins can insert internal notes"
  ON internal_notes FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can view notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public can view business settings"
  ON business_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Owners can update business settings"
  ON business_settings FOR ALL
  TO authenticated
  USING (is_owner())
  WITH CHECK (is_owner());

CREATE POLICY "Public can view published website content"
  ON website_content FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Content managers can view all website content"
  ON website_content FOR SELECT
  TO authenticated
  USING (can_manage_content());

CREATE POLICY "Content managers can update website content"
  ON website_content FOR ALL
  TO authenticated
  USING (can_manage_content())
  WITH CHECK (can_manage_content());

CREATE POLICY "Content managers can manage media library"
  ON media_library FOR ALL
  TO authenticated
  USING (can_manage_content())
  WITH CHECK (can_manage_content());

CREATE POLICY "Owners can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_owner());

CREATE POLICY "System and admins can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

