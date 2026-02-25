-- =====================================================
-- Course Content Tables (run this in Supabase SQL Editor)
-- =====================================================

-- 1. Course Modules table
CREATE TABLE IF NOT EXISTS public.course_modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  section TEXT NOT NULL,
  description TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Course Lessons table
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id TEXT PRIMARY KEY, -- e.g. "1-1", "1-2"
  module_id INTEGER NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Course Quizzes table
CREATE TABLE IF NOT EXISTS public.course_quizzes (
  id SERIAL PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_quizzes ENABLE ROW LEVEL SECURITY;

-- 5. Read policies (everyone can read course content)
CREATE POLICY "Anyone can read modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Anyone can read lessons" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can read quizzes" ON public.course_quizzes FOR SELECT USING (true);

-- 6. Admin write policies using the existing is_admin() function
CREATE POLICY "Admins can insert modules" ON public.course_modules FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update modules" ON public.course_modules FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete modules" ON public.course_modules FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can insert lessons" ON public.course_lessons FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update lessons" ON public.course_lessons FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete lessons" ON public.course_lessons FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins can insert quizzes" ON public.course_quizzes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update quizzes" ON public.course_quizzes FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete quizzes" ON public.course_quizzes FOR DELETE USING (public.is_admin());

-- 7. Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_modules_updated_at BEFORE UPDATE ON public.course_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER course_lessons_updated_at BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER course_quizzes_updated_at BEFORE UPDATE ON public.course_quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
