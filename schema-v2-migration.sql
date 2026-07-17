-- ========================================
-- Succevia Hub 2.0 - Database Migration
-- Liberia-First, Global-Ready Schema
-- ========================================

-- ====== Geographic Tables ======

CREATE TABLE IF NOT EXISTS countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  flag VARCHAR(10),
  currency VARCHAR(3),
  currency_symbol VARCHAR(5),
  phone_code VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) DEFAULT 'county', -- county, state, province, region
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id UUID REFERENCES regions(id),
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Users ======

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  whatsapp VARCHAR(20) UNIQUE,
  full_name VARCHAR(100),
  avatar_url TEXT,
  country VARCHAR(100) DEFAULT 'Liberia',
  county VARCHAR(100),
  city VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Profiles (Extended) ======

CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  title VARCHAR(100),
  skills TEXT[],
  experience_years INT DEFAULT 0,
  hourly_rate VARCHAR(20),
  availability VARCHAR(20) DEFAULT 'available',
  languages TEXT[] DEFAULT ARRAY['English'],
  education TEXT,
  certificates TEXT[],
  portfolio_images TEXT[],
  completed_jobs INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  response_time VARCHAR(50),
  is_professional BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Jobs ======

CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  organization VARCHAR(200) NOT NULL,
  organization_logo TEXT,
  type VARCHAR(50) NOT NULL, -- full-time, part-time, contract, internship, remote, volunteer
  sector VARCHAR(50) NOT NULL, -- government, ngo, private, international
  country VARCHAR(100) DEFAULT 'Liberia',
  county VARCHAR(100),
  city VARCHAR(100),
  salary_range VARCHAR(100),
  deadline DATE,
  requirements TEXT,
  responsibilities TEXT,
  application_url TEXT,
  application_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  employer_id UUID REFERENCES users(id),
  views INT DEFAULT 0,
  applications_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Scholarships ======

CREATE TABLE IF NOT EXISTS scholarships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  organization VARCHAR(200) NOT NULL,
  organization_logo TEXT,
  level VARCHAR(50) NOT NULL, -- bachelor, masters, phd, exchange, research, training, fellowship
  funding VARCHAR(50) NOT NULL, -- full, partial, grant
  field_of_study VARCHAR(200),
  country VARCHAR(100),
  university VARCHAR(200),
  deadline DATE NOT NULL,
  eligibility TEXT,
  requirements TEXT,
  benefits TEXT,
  application_url TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Service Requests ======

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  budget VARCHAR(50),
  is_negotiable BOOLEAN DEFAULT true,
  country VARCHAR(100) DEFAULT 'Liberia',
  county VARCHAR(100),
  city VARCHAR(100),
  service_mode VARCHAR(20) DEFAULT 'both', -- online, in_person, both
  deadline DATE,
  urgency VARCHAR(20) DEFAULT 'medium',
  attachments TEXT[],
  status VARCHAR(20) DEFAULT 'open',
  requester_id UUID REFERENCES users(id),
  requester_whatsapp VARCHAR(20) NOT NULL,
  requester_name VARCHAR(100),
  quotations_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Quotations ======

CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES users(id),
  amount VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  delivery_time VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Businesses ======

CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  country VARCHAR(100) DEFAULT 'Liberia',
  county VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  whatsapp VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  business_hours JSONB,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  followers_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Communities ======

CREATE TABLE IF NOT EXISTS communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  cover_url TEXT,
  icon_url TEXT,
  creator_id UUID REFERENCES users(id),
  members_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'post',
  images TEXT[],
  files TEXT[],
  poll_data JSONB,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Events ======

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  type VARCHAR(20) NOT NULL, -- online, in_person, hybrid
  country VARCHAR(100) DEFAULT 'Liberia',
  county VARCHAR(100),
  city VARCHAR(100),
  venue TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  cover_url TEXT,
  organizer VARCHAR(200) NOT NULL,
  organizer_contact VARCHAR(20),
  max_attendees INT,
  attendees_count INT DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  price VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Courses / Learning ======

CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  instructor VARCHAR(200) NOT NULL,
  instructor_bio TEXT,
  thumbnail_url TEXT,
  duration VARCHAR(50),
  level VARCHAR(20) DEFAULT 'beginner',
  is_free BOOLEAN DEFAULT true,
  price VARCHAR(50),
  syllabus TEXT[],
  enrolled_count INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Reviews ======

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES users(id),
  target_id UUID NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT NOT NULL,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Conversations / Messages ======

CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participants UUID[] NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  is_group BOOLEAN DEFAULT false,
  name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text',
  file_url TEXT,
  reply_to UUID REFERENCES messages(id),
  is_read BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Notifications ======

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ====== Saved Items ======

CREATE TABLE IF NOT EXISTS saved_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_id UUID NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- ====== Indexes ======

CREATE INDEX IF NOT EXISTS idx_jobs_country ON jobs(country);
CREATE INDEX IF NOT EXISTS idx_jobs_sector ON jobs(sector);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scholarships_level ON scholarships(level);
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships(country);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_active ON scholarships(is_active);

CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_category ON service_requests(category);
CREATE INDEX IF NOT EXISTS idx_service_requests_country ON service_requests(country);
CREATE INDEX IF NOT EXISTS idx_service_requests_urgency ON service_requests(urgency);

CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_country ON businesses(country);
CREATE INDEX IF NOT EXISTS idx_businesses_is_verified ON businesses(is_verified);

CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_saved_items_user ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);

-- ====== Insert Liberia Default Data ======

INSERT INTO countries (code, name, flag, currency, currency_symbol, phone_code, sort_order)
VALUES ('LR', 'Liberia', '🇱🇷', 'LRD', 'L$', '+231', 1)
ON CONFLICT (code) DO NOTHING;

-- Insert Liberia counties as regions
INSERT INTO regions (country_id, name, type)
SELECT id, unnest(ARRAY[
  'Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount',
  'Grand Gedeh', 'Grand Kru', 'Lofa', 'Margibi', 'Maryland',
  'Montserrado', 'Nimba', 'River Cess', 'River Gee', 'Sinoe'
]), 'county'
FROM countries WHERE code = 'LR'
ON CONFLICT DO NOTHING;

-- ====== RLS Policies ======

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- ====== Public Read Policies ======

-- Users: anyone can read public user profiles
CREATE POLICY "Public can view active users"
  ON users FOR SELECT
  USING (is_active = true);

-- Profiles: anyone can read professional profiles
CREATE POLICY "Public can view profiles"
  ON profiles FOR SELECT
  USING (true);

-- Jobs: anyone can read active jobs
CREATE POLICY "Public can view active jobs"
  ON jobs FOR SELECT
  USING (is_active = true);

-- Scholarships: anyone can read active scholarships
CREATE POLICY "Public can view active scholarships"
  ON scholarships FOR SELECT
  USING (is_active = true);

-- Service Requests: anyone can read visible requests
CREATE POLICY "Public can view visible service requests"
  ON service_requests FOR SELECT
  USING (is_visible = true);

-- Quotations: anyone can read quotations (filtered at app layer)
CREATE POLICY "Public can view quotations"
  ON quotations FOR SELECT
  USING (true);

-- Businesses: anyone can read active businesses
CREATE POLICY "Public can view active businesses"
  ON businesses FOR SELECT
  USING (is_active = true);

-- Communities: anyone can read active communities
CREATE POLICY "Public can view active communities"
  ON communities FOR SELECT
  USING (is_active = true);

-- Reviews: anyone can read reviews
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- Messages: only participants can read their messages
CREATE POLICY "Participants can view messages"
  ON messages FOR SELECT
  USING (auth.uid() = ANY(
    SELECT unnest(participants) FROM conversations WHERE id = conversation_id
  ));

-- Notifications: only the owner can read their notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Saved Items: only the owner can read their saved items
CREATE POLICY "Users can view own saved items"
  ON saved_items FOR SELECT
  USING (auth.uid() = user_id);

-- ====== Service Role Policies (Full Access) ======

CREATE POLICY "Service role all access users" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access profiles" ON profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access jobs" ON jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access scholarships" ON scholarships FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access service_requests" ON service_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access quotations" ON quotations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access businesses" ON businesses FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access communities" ON communities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access reviews" ON reviews FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access messages" ON messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role all access saved_items" ON saved_items FOR ALL USING (auth.role() = 'service_role');
