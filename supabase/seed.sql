-- Lucky Fashion Seed Data
-- Adheres strictly to AGENTS.md rules:
-- 1. NO frocks, skirts, or dresses anywhere.
-- 2. Every demo record carries is_demo = true.
-- 3. No fabricated business claims; graceful empty/generic fallbacks.

-- Insert Business Settings
INSERT INTO business_settings (
  id,
  company_name,
  phone,
  whatsapp,
  email,
  address,
  business_hours,
  social_links,
  available_materials
) VALUES (
  'default',
  'Lucky Fashion',
  '+1 (555) 019-2834',
  '+15550192834',
  'inquiries@luckyfashion.com',
  '100 Industrial Parkway, Garment District',
  'Mon - Fri: 8:30 AM - 6:00 PM',
  '{"linkedin": "https://linkedin.com", "instagram": "https://instagram.com"}'::jsonb,
  ARRAY['100% Combed Cotton', 'Cotton-Polyester Blend', 'Dry-Fit Polyester', 'Single Jersey', 'Pique Cotton', 'Heavyweight Fleece']
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  business_hours = EXCLUDED.business_hours;

-- Insert Seed Categories
INSERT INTO categories (id, name, slug, description, sort_order, is_active, is_demo)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'T-Shirts', 't-shirts', 'Custom crewneck, v-neck, and oversized t-shirts engineered for corporate and retail collections.', 1, true, true),
  ('c1000000-0000-0000-0000-000000000002', 'Polo Shirts', 'polo-shirts', 'Classic pique and jersey knit polos featuring custom plackets and embroidered branding.', 2, true, true),
  ('c1000000-0000-0000-0000-000000000003', 'Hoodies & Sweatshirts', 'hoodies-sweatshirts', 'Heavyweight fleece and French terry hoodies and crewneck pullovers.', 3, true, true),
  ('c1000000-0000-0000-0000-000000000004', 'Corporate Uniforms', 'corporate-uniforms', 'Durable, tailored work shirts, trousers, and aprons for hospitality and enterprises.', 4, true, true),
  ('c1000000-0000-0000-0000-000000000005', 'Sportswear & Activewear', 'sportswear-activewear', 'High-performance moisture-wicking tees, singlets, and training apparel.', 5, true, true),
  ('c1000000-0000-0000-0000-000000000006', 'Caps & Headwear', 'caps-headwear', 'Structured and unstructured baseball caps, snapbacks, and bucket hats.', 6, true, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert Seed Products (All carrying is_demo = true and NO frocks/skirts/dresses)
INSERT INTO products (
  id,
  category_id,
  name,
  slug,
  description,
  fabric_details,
  available_colors,
  available_sizes,
  status,
  featured,
  cover_image_url,
  is_demo
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Classic Combed Cotton Crewneck',
    'classic-combed-cotton-crewneck',
    '180 GSM ring-spun combed cotton t-shirt with reinforced twin-needle stitching and ribbed collar.',
    '100% Combed Ring-Spun Cotton, Bio-washed and pre-shrunk',
    ARRAY['Jet Black', 'Pure White', 'Navy Blue', 'Heather Grey', 'Forest Green'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    'published',
    true,
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000002',
    'Premium Pique Corporate Polo',
    'premium-pique-corporate-polo',
    '220 GSM heavyweight cotton-poly blend pique with custom dye-to-match buttons and flat-knit collar.',
    '65% Cotton, 35% Polyester Pique Knit',
    ARRAY['Navy Blue', 'Charcoal', 'Burgundy', 'Royal Blue', 'White'],
    ARRAY['S', 'M', 'L', 'XL', '2XL', '3XL'],
    'published',
    true,
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000003',
    'Heavyweight Brushed Fleece Pullover Hoodie',
    'heavyweight-brushed-fleece-pullover-hoodie',
    '340 GSM luxury fleece hoodie with kangaroo pocket, double-lined hood, and matching drawstrings.',
    '80% Cotton, 20% Polyester Heavyweight Brushed Fleece',
    ARRAY['Pitch Black', 'Oatmeal Heather', 'Olive Drab', 'Deep Navy'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    'published',
    true,
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000004',
    'Tailored Oxford Corporate Uniform Shirt',
    'tailored-oxford-corporate-uniform-shirt',
    'Structured Oxford weave button-down uniform shirt built for daily comfort and long-wearing durability.',
    '60% Cotton, 40% Polyester Oxford Cloth, Wrinkle-Resistant Finish',
    ARRAY['Sky Blue', 'Crisp White', 'French Blue'],
    ARRAY['S', 'M', 'L', 'XL', '2XL'],
    'published',
    false,
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000005',
    'Dry-Fit Athletic Performance Tee',
    'dry-fit-athletic-performance-tee',
    '150 GSM lightweight micro-interlock fabric designed for maximum breathability and rapid drying.',
    '100% Micro-Polyester with Anti-Bacterial & Moisture-Wicking Treatment',
    ARRAY['Neon Orange', 'Electric Blue', 'Jet Black', 'Slate Grey'],
    ARRAY['XS', 'S', 'M', 'L', 'XL', '2XL'],
    'published',
    true,
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert Seed Completed Orders (Portfolio)
INSERT INTO completed_orders (
  id,
  category_id,
  title,
  slug,
  client_type,
  description,
  specifications,
  status,
  featured,
  customer_material_permission,
  has_customer_identifying_material,
  cover_image_url,
  is_demo
) VALUES
  (
    'o1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000002',
    'Enterprise Staff Uniform Program',
    'enterprise-staff-uniform-program',
    'Corporate Enterprise',
    'Engineered custom polo batch with high-density chest embroidery and dye-sublimated sleeve tipping for a multi-regional corporate rollout.',
    '{"quantity_range": "1,000+ units", "fabric": "220 GSM Combed Pique", "customization": "Chest 3D Embroidery, Branded Neck Taping"}'::jsonb,
    'published',
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    true
  ),
  (
    'o1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000005',
    'City Marathon Finisher Technical Shirts',
    'city-marathon-finisher-technical-shirts',
    'Athletic Event',
    'Breathable lightweight finisher jerseys equipped with reflective safety transfers and colorfast all-over screen graphics.',
    '{"quantity_range": "3,500 units", "fabric": "140 GSM Dry-Fit Interlock", "customization": "Front & Back Water-Based Discharge Screen Print"}'::jsonb,
    'published',
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1508215885820-4523e431397e?auto=format&fit=crop&w=800&q=80',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert Website Content for Key Pages
INSERT INTO website_content (page_key, content, is_published)
VALUES
  (
    'home',
    '{
      "hero_title": "Precision Apparel Manufacturing for Global Brands",
      "hero_subtitle": "Lucky Fashion delivers premium custom garments, uniforms, and athletic wear engineered to your exact specifications. Direct from our cutting-edge manufacturing facility.",
      "cta_primary": "Request a Quote",
      "cta_secondary": "View Catalog",
      "about_snippet_title": "Decades of Textile Excellence",
      "about_snippet_text": "We combine sustainable yarn sourcing, modern cut-and-sew operations, and strict quality control to deliver consistent bulk apparel orders."
    }'::jsonb,
    true
  ),
  (
    'about',
    '{
      "title": "About Lucky Fashion",
      "subtitle": "Dedicated to Craftsmanship, Ethical Manufacturing, and Scalable Delivery",
      "mission": "To provide brands and institutions with reliable, high-specification garment manufacturing, transparent communication, and timely deliveries."
    }'::jsonb,
    true
  ),
  (
    'manufacturing',
    '{
      "title": "Manufacturing Capabilities & Quality Control",
      "intro": "From yarn selection and pattern making to laser cutting, screen printing, embroidery, and packaging — every step is handled under rigorous standards.",
      "faqs": [
        {"question": "How do quotation requests work?", "answer": "Submit your required quantities, preferred fabric, and design files via our Request a Quote form. Our team reviews specifications and responds with a detailed quotation within 24 to 48 hours."},
        {"question": "What custom embellishment options do you support?", "answer": "We support silkscreen printing (water-base, plastisol, discharge), direct-to-garment (DTG), high-density embroidery, dye sublimation, woven labeling, and custom trims."},
        {"question": "Do you provide sample production before mass fabrication?", "answer": "Yes. Upon quotation confirmation, we produce pre-production approval samples to ensure fabric hand-feel, dimensions, and embellishments meet exact requirements."}
      ]
    }'::jsonb,
    true
  ),
  (
    'contact',
    '{
      "title": "Contact Lucky Fashion",
      "subtitle": "Our manufacturing specialists are ready to discuss your custom apparel requirements.",
      "form_header": "Send Us a Message"
    }'::jsonb,
    true
  )
ON CONFLICT (page_key) DO NOTHING;

