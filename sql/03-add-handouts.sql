-- =====================================================
-- Add handout support to lessons
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add handout_url column to course_lessons
ALTER TABLE public.course_lessons ADD COLUMN IF NOT EXISTS handout_url TEXT;
ALTER TABLE public.course_lessons ADD COLUMN IF NOT EXISTS handout_name TEXT;
