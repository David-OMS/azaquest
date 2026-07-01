-- Allow public read of archived products (shown on /sold after image cleanup)
DROP POLICY IF EXISTS "Public read available sold products" ON products;

CREATE POLICY "Public read available sold products" ON products
  FOR SELECT USING (status IN ('available', 'sold', 'archived'));
