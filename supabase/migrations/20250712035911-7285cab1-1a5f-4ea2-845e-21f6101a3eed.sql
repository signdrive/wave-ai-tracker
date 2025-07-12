-- Create tables for monetization features

-- Surf Gear Marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- surfboard, wetsuit, fins, accessories, etc.
  condition TEXT NOT NULL DEFAULT 'used', -- new, excellent, good, fair, poor
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  brand TEXT,
  model TEXT,
  size_info TEXT, -- board length, wetsuit size, etc.
  images TEXT[], -- array of image URLs
  location_city TEXT,
  location_country TEXT,
  status TEXT DEFAULT 'active', -- active, sold, deleted
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Surf Lessons
CREATE TABLE IF NOT EXISTS public.surf_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  instructor_name TEXT NOT NULL,
  bio TEXT,
  experience_years INTEGER,
  certifications TEXT[],
  languages TEXT[],
  hourly_rate DECIMAL(10,2) NOT NULL,
  location_city TEXT NOT NULL,
  location_country TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_reviews INTEGER DEFAULT 0,
  specialties TEXT[], -- beginner, intermediate, advanced, surfboard_repair, etc.
  availability_schedule JSONB, -- weekly schedule
  profile_image TEXT,
  contact_info JSONB, -- phone, email, website
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lesson_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  instructor_id UUID NOT NULL,
  lesson_date TIMESTAMPTZ NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 2,
  lesson_type TEXT NOT NULL, -- private, group, beginner, intermediate, advanced
  location_spot_id TEXT,
  location_description TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  student_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  special_requests TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  instructor_notes TEXT,
  student_feedback TEXT,
  rating INTEGER, -- 1-5 stars
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Surf Travel Packages
CREATE TABLE IF NOT EXISTS public.travel_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name TEXT NOT NULL,
  description TEXT NOT NULL,
  destination TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  max_participants INTEGER DEFAULT 12,
  difficulty_level TEXT NOT NULL, -- beginner, intermediate, advanced, all_levels
  included_services TEXT[], -- accommodation, meals, lessons, equipment, transport
  surf_spots TEXT[], -- list of spot names/ids
  best_season TEXT, -- when to visit
  weather_requirements JSONB, -- ideal conditions
  package_images TEXT[],
  operator_contact JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.travel_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  package_id UUID NOT NULL,
  travel_dates DATERANGE NOT NULL,
  participant_count INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  payment_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  contact_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhanced weather data for premium users
CREATE TABLE IF NOT EXISTS public.premium_weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id TEXT NOT NULL,
  forecast_date TIMESTAMPTZ NOT NULL,
  detailed_forecast JSONB NOT NULL, -- extended forecast data
  accuracy_score DECIMAL(3,2),
  data_source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surf_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_weather_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Marketplace listings policies
CREATE POLICY "marketplace_listings_select" ON public.marketplace_listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "marketplace_listings_insert" ON public.marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "marketplace_listings_update" ON public.marketplace_listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "marketplace_listings_delete" ON public.marketplace_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Surf instructors policies
CREATE POLICY "surf_instructors_select" ON public.surf_instructors
  FOR SELECT USING (status = 'active');

CREATE POLICY "surf_instructors_insert" ON public.surf_instructors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "surf_instructors_update" ON public.surf_instructors
  FOR UPDATE USING (auth.uid() = user_id);

-- Lesson bookings policies
CREATE POLICY "lesson_bookings_select" ON public.lesson_bookings
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() IN (
    SELECT user_id FROM surf_instructors WHERE id = instructor_id
  ));

CREATE POLICY "lesson_bookings_insert" ON public.lesson_bookings
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "lesson_bookings_update" ON public.lesson_bookings
  FOR UPDATE USING (auth.uid() = student_id OR auth.uid() IN (
    SELECT user_id FROM surf_instructors WHERE id = instructor_id
  ));

-- Travel packages policies
CREATE POLICY "travel_packages_select" ON public.travel_packages
  FOR SELECT USING (status = 'active');

-- Travel bookings policies
CREATE POLICY "travel_bookings_select" ON public.travel_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "travel_bookings_insert" ON public.travel_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "travel_bookings_update" ON public.travel_bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Premium weather data policies
CREATE POLICY "premium_weather_select" ON public.premium_weather_data
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM subscriptions WHERE status = 'active'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON public.marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_location ON public.marketplace_listings(location_city, location_country);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON public.marketplace_listings(status);

CREATE INDEX IF NOT EXISTS idx_surf_instructors_location ON public.surf_instructors(location_city, location_country);
CREATE INDEX IF NOT EXISTS idx_surf_instructors_status ON public.surf_instructors(status);

CREATE INDEX IF NOT EXISTS idx_lesson_bookings_instructor ON public.lesson_bookings(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lesson_bookings_student ON public.lesson_bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_bookings_date ON public.lesson_bookings(lesson_date);

CREATE INDEX IF NOT EXISTS idx_travel_packages_destination ON public.travel_packages(destination);
CREATE INDEX IF NOT EXISTS idx_travel_packages_status ON public.travel_packages(status);

CREATE INDEX IF NOT EXISTS idx_premium_weather_spot_date ON public.premium_weather_data(spot_id, forecast_date);

-- Add update timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketplace_listings_updated_at BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_surf_instructors_updated_at BEFORE UPDATE ON public.surf_instructors
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_lesson_bookings_updated_at BEFORE UPDATE ON public.lesson_bookings
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_travel_packages_updated_at BEFORE UPDATE ON public.travel_packages
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_travel_bookings_updated_at BEFORE UPDATE ON public.travel_bookings
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();