import { supabase } from "./supabase";
import { MODULES as STATIC_MODULES, SECTIONS, type Module } from "./course-data";
import type { Course, UserCourseAccess } from "./types";

export { SECTIONS };

// ===== Course Functions =====

/**
 * Load all active courses from the database
 */
export async function loadCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error || !data) return [];

    // Get module counts per course
    const { data: modules } = await supabase
      .from("course_modules")
      .select("id, course_id");

    const { data: lessons } = await supabase
      .from("course_lessons")
      .select("id, module_id");

    return data.map(course => {
      const courseModules = (modules || []).filter(m => m.course_id === course.id);
      const courseModuleIds = courseModules.map(m => m.id);
      const courseLessons = (lessons || []).filter(l => courseModuleIds.includes(l.module_id));
      return {
        ...course,
        module_count: courseModules.length,
        lesson_count: courseLessons.length,
      };
    });
  } catch (err) {
    console.error("Error loading courses:", err);
    return [];
  }
}

/**
 * Load a single course by slug
 */
export async function loadCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Load user's course access records
 */
export async function loadUserCourses(userId: string): Promise<UserCourseAccess[]> {
  try {
    const { data, error } = await supabase
      .from("user_courses")
      .select("*")
      .eq("user_id", userId);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/**
 * Check if a user has full access to a course
 */
export function hasFullAccess(
  course: Course,
  userAccess: UserCourseAccess | undefined,
  isInternal: boolean
): boolean {
  // Internal courses require is_internal flag
  if (course.visibility === "internal" && !isInternal) return false;

  // Free courses: any logged-in user has full access
  if (course.price === 0) return true;

  // Paid courses: need purchased or granted access
  if (!userAccess) return false;
  return userAccess.access_type === "purchased" || userAccess.access_type === "granted";
}

// ===== Module Functions =====

/**
 * Load course modules from Supabase database, optionally filtered by courseId.
 * Falls back to static course-data.ts if database tables don't exist or are empty.
 */
export async function loadModules(courseId?: number): Promise<Module[]> {
  try {
    // Try loading from database
    let query = supabase.from("course_modules").select("*").order("sort_order");
    if (courseId) {
      query = query.eq("course_id", courseId);
    }
    const { data: dbModules, error: modErr } = await query;

    if (modErr || !dbModules || dbModules.length === 0) {
      // Fall back to static data only for AI Mastery (course 1 or no courseId)
      if (!courseId || courseId === 1) {
        console.log("Using static course data (database not available or empty)");
        return STATIC_MODULES;
      }
      return [];
    }

    // Load lessons and quizzes for these modules
    const moduleIds = dbModules.map(m => m.id);
    const [lessonsRes, quizzesRes] = await Promise.all([
      supabase.from("course_lessons").select("*").in("module_id", moduleIds).order("sort_order"),
      supabase.from("course_quizzes").select("*").in("module_id", moduleIds).order("sort_order"),
    ]);

    const dbLessons = lessonsRes.data || [];
    const dbQuizzes = quizzesRes.data || [];

    // Assemble into Module format
    const modules: Module[] = dbModules.map(mod => ({
      id: mod.id,
      title: mod.title,
      section: mod.section,
      description: mod.description,
      tier: mod.tier as "free" | "premium",
      lessons: dbLessons
        .filter(l => l.module_id === mod.id)
        .map(l => ({
          id: l.id,
          title: l.title,
          content: l.content,
          videoUrl: l.video_url || undefined,
          handoutUrl: l.handout_url || undefined,
          handoutName: l.handout_name || undefined,
        })),
      quiz: dbQuizzes
        .filter(q => q.module_id === mod.id)
        .map(q => ({
          question: q.question,
          options: q.options,
          correct: q.correct_index,
        })),
    }));

    return modules;
  } catch (err) {
    console.error("Error loading from database, using static data:", err);
    if (!courseId || courseId === 1) return STATIC_MODULES;
    return [];
  }
}

/**
 * Build dynamic sections based on loaded modules
 */
export function buildSections(modules: Module[]) {
  // If we have the standard 17 modules, use predefined sections
  if (modules.length <= 17 && modules.every(m => STATIC_MODULES.find(sm => sm.id === m.id))) {
    return SECTIONS;
  }

  // Build dynamic sections from module data
  const sectionMap = new Map<string, { name: string; modules: number[]; tier: "free" | "premium" }>();

  for (const mod of modules) {
    const sectionName = mod.section;
    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, {
        name: sectionName.startsWith("Section") ? sectionName : `${sectionName}`,
        modules: [],
        tier: mod.tier,
      });
    }
    sectionMap.get(sectionName)!.modules.push(mod.id);
    if (mod.tier === "premium") {
      sectionMap.get(sectionName)!.tier = "premium";
    }
  }

  return Array.from(sectionMap.values());
}
