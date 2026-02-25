// ===== Course Platform Types =====

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  image_url?: string;
  visibility: "public" | "internal";
  price: number; // cents (0 = free)
  stripe_price_id?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  // Computed fields (not in DB)
  module_count?: number;
  lesson_count?: number;
}

export interface UserCourseAccess {
  id: number;
  user_id: string;
  course_id: number;
  access_type: "free" | "purchased" | "granted";
  stripe_session_id?: string;
  created_at?: string;
}

export type CourseAccessLevel = "full" | "limited" | "none";
