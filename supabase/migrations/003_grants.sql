-- Required when "Automatically expose new tables" is disabled in Supabase.
-- Grants API roles access to tables created in 001_initial.sql.

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;

-- Explicit grants per table (idempotent)
GRANT ALL ON categories TO service_role;
GRANT SELECT ON categories TO anon, authenticated;

GRANT ALL ON drops TO service_role;
GRANT SELECT ON drops TO anon, authenticated;

GRANT ALL ON products TO service_role;
GRANT SELECT ON products TO anon, authenticated;

GRANT ALL ON product_images TO service_role;
GRANT SELECT ON product_images TO anon, authenticated;

GRANT ALL ON site_settings TO service_role;
GRANT SELECT ON site_settings TO anon, authenticated;
