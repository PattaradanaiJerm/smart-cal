-- Run this SQL in Supabase SQL Editor
-- Project: D-Calc Analytics

-- 1. Page views
CREATE TABLE IF NOT EXISTS page_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page       text NOT NULL,
  locale     text,
  referrer   text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- 2. Calculator usage events
CREATE TABLE IF NOT EXISTS calculator_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       text NOT NULL,
  locale     text,
  created_at timestamptz DEFAULT now()
);

-- 3. UI interaction events
CREATE TABLE IF NOT EXISTS ui_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  payload    jsonb,
  created_at timestamptz DEFAULT now()
);

-- 4. Error logs
CREATE TABLE IF NOT EXISTS error_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type       text,   -- '404' | '500' | 'js_error'
  path       text,
  message    text,
  created_at timestamptz DEFAULT now()
);

-- 5. Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_th   text NOT NULL,
  title_en   text NOT NULL,
  body_th    text NOT NULL,
  body_en    text NOT NULL,
  published  boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic      text NOT NULL,
  message    text NOT NULL,
  locale     text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calc_events_slug ON calculator_events(slug);
CREATE INDEX IF NOT EXISTS idx_calc_events_created ON calculator_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(type);

-- Row Level Security: allow insert from anon (for logging), restrict read to authenticated admin
ALTER TABLE page_views        ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements     ENABLE ROW LEVEL SECURITY;

-- Logging tables: allow insert from anon/service role, deny read from anon
CREATE POLICY "insert_page_views"        ON page_views        FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "insert_calc_events"       ON calculator_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "insert_ui_events"         ON ui_events         FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "insert_error_logs"        ON error_logs        FOR INSERT TO anon WITH CHECK (true);

-- Admin read (authenticated users)
CREATE POLICY "admin_read_page_views"    ON page_views        FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_read_calc_events"   ON calculator_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_read_ui_events"     ON ui_events         FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_read_error_logs"    ON error_logs        FOR SELECT TO authenticated USING (true);

-- Announcements: public can read published, authenticated can CRUD
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT TO anon USING (published = true);
CREATE POLICY "admin_all_announcements"   ON announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);
