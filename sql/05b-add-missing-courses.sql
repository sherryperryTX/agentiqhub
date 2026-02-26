-- =============================================
-- Add Missing Courses
-- Run this BEFORE sql/06, 07, 08, 09
-- =============================================
-- These courses were referenced in content SQL files
-- but were not found in the database.

-- Check what columns exist and match the pattern of existing courses
-- Existing courses: ai-mastery, property-comparative-analysis, real-estate-tools-training, difficult_transactions

INSERT INTO courses (title, slug, description, image_url)
VALUES (
  'Undivided Interest in Property Ownership',
  'undivided-interest-property-ownership',
  'Master the complexities of shared property ownership. Learn about tenancy in common, joint tenancy, partition actions, and how to guide clients through co-ownership transactions.',
  '/images/courses/undivided-interest.jpg'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (title, slug, description, image_url)
VALUES (
  'Representing Your Client in a Short Sale',
  'representing-client-short-sale',
  'Navigate the short sale process from start to finish. Learn lender negotiation, documentation requirements, and how to successfully close short sale transactions for buyers and sellers.',
  '/images/courses/short-sale.jpg'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (title, slug, description, image_url)
VALUES (
  'Representing Buyers in Foreclosed Properties',
  'representing-buyers-foreclosed-properties',
  'Guide buyers through foreclosure purchases including pre-foreclosures, auctions, REO properties, and government-owned homes. Learn risk assessment, financing options, and negotiation strategies.',
  '/images/courses/foreclosed-properties.jpg'
)
ON CONFLICT (slug) DO NOTHING;
