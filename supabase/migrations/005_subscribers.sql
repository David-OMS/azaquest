CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- No public read; inserts via service role API only
CREATE POLICY "No public access subscribers" ON subscribers FOR SELECT USING (false);

GRANT ALL ON subscribers TO service_role;
