-- ============================================================
-- AgentIQ Hub: Multi-Course Platform Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT,
  image_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'internal')),
  price INTEGER NOT NULL DEFAULT 0,  -- price in cents (0 = free, 19700 = $197.00)
  stripe_price_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create user_courses table (tracks who has access to which courses)
CREATE TABLE IF NOT EXISTS public.user_courses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL DEFAULT 'free' CHECK (access_type IN ('free', 'purchased', 'granted')),
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 3. Add course_id to course_modules (link modules to courses)
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS course_id INTEGER REFERENCES public.courses(id) ON DELETE SET NULL;

-- 4. Add is_internal flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_internal BOOLEAN DEFAULT false;

-- ============================================================
-- RLS Policies for courses table
-- ============================================================
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Anyone can read active public courses
CREATE POLICY "Anyone can read active courses" ON public.courses
  FOR SELECT USING (is_active = true);

-- Admins can do everything with courses
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (public.is_admin());

-- ============================================================
-- RLS Policies for user_courses table
-- ============================================================
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

-- Users can read their own course access
CREATE POLICY "Users can read own course access" ON public.user_courses
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage all course access
CREATE POLICY "Admins can manage course access" ON public.user_courses
  FOR ALL USING (public.is_admin());

-- Allow insert for webhook/checkout (service role handles this, but also allow for authenticated users getting free courses)
CREATE POLICY "Users can enroll in free courses" ON public.user_courses
  FOR INSERT WITH CHECK (auth.uid() = user_id AND access_type = 'free');

-- ============================================================
-- Seed: Create AI Mastery as Course #1
-- ============================================================
INSERT INTO public.courses (slug, title, description, short_description, visibility, price, is_active, sort_order)
VALUES (
  'ai-mastery',
  'AI Mastery for Real Estate Agents',
  'Master artificial intelligence tools to transform your real estate business. Learn to use AI for listings, client communications, market analysis, marketing materials, and more. 17 comprehensive modules from beginner to certification.',
  'Learn to use AI tools like Claude to supercharge your real estate business.',
  'public',
  19700,
  true,
  1
) ON CONFLICT (slug) DO NOTHING;

-- Assign all existing modules to the AI Mastery course
UPDATE public.course_modules SET course_id = (SELECT id FROM public.courses WHERE slug = 'ai-mastery') WHERE course_id IS NULL;

-- ============================================================
-- Migrate existing users to user_courses table
-- ============================================================

-- Premium users get 'purchased' access to AI Mastery
INSERT INTO public.user_courses (user_id, course_id, access_type)
SELECT p.id, c.id, 'purchased'
FROM public.profiles p
CROSS JOIN public.courses c
WHERE c.slug = 'ai-mastery' AND p.tier = 'premium'
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Free users get 'free' access to AI Mastery
INSERT INTO public.user_courses (user_id, course_id, access_type)
SELECT p.id, c.id, 'free'
FROM public.profiles p
CROSS JOIN public.courses c
WHERE c.slug = 'ai-mastery' AND (p.tier = 'free' OR p.tier IS NULL)
ON CONFLICT (user_id, course_id) DO NOTHING;

-- ============================================================
-- Done! Verify with:
-- SELECT * FROM public.courses;
-- SELECT * FROM public.user_courses;
-- SELECT id, title, course_id FROM public.course_modules LIMIT 5;
-- ============================================================
