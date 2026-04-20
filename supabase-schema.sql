-- ============================================================
-- Paws Care and Heal Pet Clinic — Supabase Schema
-- Run this complete script in Supabase SQL Editor
-- ============================================================

-- 1. PETS TABLE
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  pet_type TEXT NOT NULL DEFAULT 'Dog',
  pet_age TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pets_mobile ON pets(mobile);
CREATE INDEX idx_pets_pet_name ON pets(lower(pet_name));
CREATE INDEX idx_pets_owner ON pets(lower(owner_name));

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All access pets" ON pets FOR ALL USING (true) WITH CHECK (true);

-- 2. VISITS TABLE (one pet → many visits)
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  medicines TEXT,
  next_reminder_date DATE,
  reminder_message TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visits_pet_id ON visits(pet_id);
CREATE INDEX idx_visits_reminder_date ON visits(next_reminder_date);
CREATE INDEX idx_visits_reminder_sent ON visits(reminder_sent);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All access visits" ON visits FOR ALL USING (true) WITH CHECK (true);

-- 3. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  pet_name TEXT NOT NULL,
  pet_type TEXT DEFAULT 'Dog',
  pet_age TEXT,
  problem TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','done','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appts_date ON appointments(preferred_date);
CREATE INDEX idx_appts_status ON appointments(status);
CREATE INDEX idx_appts_mobile ON appointments(mobile);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert appts" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read appts" ON appointments FOR SELECT USING (true);
CREATE POLICY "Admin update appts" ON appointments FOR UPDATE USING (true);

-- 4. SUCCESS STORIES TABLE
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_name TEXT NOT NULL,
  pet_type TEXT DEFAULT 'Dog',
  owner_name TEXT,
  problem_tags TEXT[],
  story TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  bg_color TEXT DEFAULT '#F5A623',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stories" ON stories FOR SELECT USING (true);
CREATE POLICY "Admin manage stories" ON stories FOR ALL USING (true) WITH CHECK (true);

-- 5. SERVICES TABLE (editable prices)
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_mins INTEGER,
  price_from INTEGER,
  price_to INTEGER,
  price_display TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Admin manage services" ON services FOR ALL USING (true) WITH CHECK (true);

-- 6. USEFUL VIEWS
CREATE OR REPLACE VIEW due_today AS
SELECT v.*, p.owner_name, p.mobile, p.pet_name, p.pet_type
FROM visits v JOIN pets p ON v.pet_id = p.id
WHERE v.next_reminder_date = CURRENT_DATE AND v.reminder_sent = false;

CREATE OR REPLACE VIEW due_soon AS
SELECT v.*, p.owner_name, p.mobile, p.pet_name, p.pet_type,
       (v.next_reminder_date - CURRENT_DATE) AS days_until
FROM visits v JOIN pets p ON v.pet_id = p.id
WHERE v.next_reminder_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 3
  AND v.reminder_sent = false
ORDER BY v.next_reminder_date;

CREATE OR REPLACE VIEW today_appointments AS
SELECT * FROM appointments
WHERE preferred_date = CURRENT_DATE
ORDER BY preferred_time;

-- 7. AUTO-UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 8. SEED DATA
INSERT INTO services (name, description, duration_mins, price_display, category, display_order) VALUES
  ('General Checkup', 'Full physical examination, vital signs', 20, '₹500', 'general', 1),
  ('Vaccination (per dose)', 'Rabies, DHPP, FVRCP and other vaccines', 15, '₹300–₹1,200', 'prevention', 2),
  ('Deworming', 'Safe oral antiparasitic medication', 10, '₹250', 'prevention', 3),
  ('Blood Test (CBC)', 'Complete blood count and analysis', 30, '₹700', 'diagnostics', 4),
  ('X-Ray', 'Digital radiography for bones and organs', 30, '₹900', 'diagnostics', 5),
  ('Ultrasound Scan', 'Abdominal and reproductive imaging', 30, '₹1,200', 'diagnostics', 6),
  ('Grooming (Basic)', 'Bath, blow-dry, nail trim, ear cleaning', 45, '₹400', 'grooming', 7),
  ('Grooming (Full)', 'Bath, styling, nail trim, ear, dental brush', 90, '₹900', 'grooming', 8),
  ('Dental Cleaning', 'Ultrasonic scaling under sedation', 60, '₹1,800', 'dental', 9),
  ('Minor Surgery', 'Wound suturing, abscess drainage', NULL, '₹2,500+', 'surgery', 10),
  ('New Pet Exam', 'Complete new pet workup + vaccination plan', 30, '₹799', 'general', 11),
  ('Microchipping', 'ISO standard chip for permanent ID', 10, '₹1,000', 'general', 12);

INSERT INTO stories (pet_name, pet_type, owner_name, problem_tags, story, bg_color, is_featured) VALUES
  ('Rocky', 'Dog', 'Vikram M.', ARRAY['Skin infection','Hair loss'], 'Rocky came in with severe skin infection and hair loss. After 3 weeks of medicated shampoo and antibiotics, he made a full recovery!', '#F5A623', true),
  ('Kitty', 'Cat', 'Sunita P.', ARRAY['Malnutrition','Dull coat'], 'Kitty was severely malnourished. After a customized nutrition plan, she transformed into a healthy, shiny Persian cat!', '#5BC8D4', true),
  ('Bruno', 'Dog', 'Rahul K.', ARRAY['Limping','Joint pain'], 'Bruno came in limping with severe joint pain. After physiotherapy, he is back to running at the park every morning!', '#9333EA', false);

INSERT INTO pets (owner_name, mobile, pet_name, pet_type, pet_age) VALUES
  ('Priya Desai', '9876543210', 'Tommy', 'Dog', '3 years'),
  ('Rahul Kulkarni', '9988776655', 'Mimi', 'Cat', '2 years'),
  ('Sunita Patil', '8765432100', 'Bruno', 'Dog', '5 years');
