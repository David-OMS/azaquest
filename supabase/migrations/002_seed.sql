-- Seed categories and sample products for development

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Shirts', 'shirts', 1),
  ('Tees', 'tees', 2),
  ('Long Sleeves', 'long-sleeves', 3),
  ('Quarter Zips', 'quarter-zips', 4),
  ('Hoodies', 'hoodies', 5),
  ('Jackets', 'jackets', 6),
  ('Vests', 'vests', 7),
  ('Pants', 'pants', 8),
  ('Jeans', 'jeans', 9),
  ('Shorts', 'shorts', 10),
  ('Rings', 'rings', 11),
  ('Accessories', 'accessories', 12),
  ('Socks', 'socks', 13);

INSERT INTO drops (name, is_active) VALUES ('Week 1 Drop', true);

-- Sample products (uses category slugs via subquery)
INSERT INTO products (slug, name, category_id, size, price, status, is_new_drop, sku, search_tokens, drop_id)
SELECT
  v.slug, v.name, c.id, v.size, v.price, v.status::product_status, v.is_new_drop, v.sku, v.search_tokens, d.id
FROM (VALUES
  ('aesthetic-collar-longsleeve-xl', 'Aesthetic Collar Longsleeve', 'long-sleeves', 'XL', 8500, 'available', true, 'AZQ-0001', 'aesthetic collar longsleeve xl 8500'),
  ('vintage-quarter-zip-m', 'Vintage Quarter Zip', 'quarter-zips', 'M', 12000, 'available', true, 'AZQ-0002', 'vintage quarter zip m 12000'),
  ('baggy-jeans-32', 'Baggy Jeans', 'jeans', '32', 18000, 'available', true, 'AZQ-0003', 'baggy jeans 32 18000'),
  ('graphic-tee-l', 'Graphic Tee', 'tees', 'L', 6500, 'available', false, 'AZQ-0004', 'graphic tee l 6500'),
  ('aesthetic-ring-set', 'Aesthetic Ring Set', 'rings', 'One size', 6000, 'available', true, 'AZQ-0005', 'aesthetic ring set one size 6000'),
  ('drew-socks', 'Drew Socks', 'socks', 'One size', 3000, 'available', false, 'AZQ-0006', 'drew socks one size 3000'),
  ('cargo-vest-l', 'Cargo Vest', 'vests', 'L', 15000, 'available', false, 'AZQ-0007', 'cargo vest l 15000'),
  ('sold-hoodie-xl', 'Vintage Hoodie', 'hoodies', 'XL', 14000, 'sold', false, 'AZQ-0008', 'vintage hoodie xl 14000')
) AS v(slug, name, cat_slug, size, price, status, is_new_drop, sku, search_tokens)
JOIN categories c ON c.slug = v.cat_slug
CROSS JOIN drops d
WHERE d.name = 'Week 1 Drop';

UPDATE products SET sold_at = now() - interval '2 days' WHERE slug = 'sold-hoodie-xl';
UPDATE products SET price_max = 20000 WHERE slug = 'aesthetic-ring-set';

-- Placeholder images (replace with R2 URLs in production)
INSERT INTO product_images (product_id, url, sort_order, alt)
SELECT p.id, 'https://picsum.photos/seed/' || p.sku || '/600/800', 0, p.name
FROM products p;

INSERT INTO product_images (product_id, url, sort_order, alt)
SELECT p.id, 'https://picsum.photos/seed/' || p.sku || 'b/600/800', 1, p.name || ' detail'
FROM products p
WHERE p.status = 'available';
