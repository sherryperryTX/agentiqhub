import { supabase } from "./supabase";
import { MODULES as STATIC_MODULES, SECTIONS, type Module } from "./course-data";

export { SECTIONS };

/**
 * Load course modules from Supabase database.
 * Falls back to static course-data.ts if database tables don't exist or are empty.
 */
export async function loadModules(): Promise<Module[]> {
  try {
    // Try loading from database
    const { data: dbModules, error: modErr } = await supabase
      .from("course_modules")
      .select("*")
      .order("sort_order");

    if (modErr || !dbModules || dbModules.length === 0) {
      // Fall back to static data
      console.log("Using static course data (database not available or empty)");
      return STATIC_MODULES;
    }

    // Load lessons and quizzes
    const [lessonsRes, quizzesRes] = await Promise.all([
      supabase.from("course_lessons").select("*").order("sort_order"),
      supabase.from("course_quizzes").select("*").order("sort_order"),
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
    return STATIC_MODULES;
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
    // If any module in section is premium, mark section as premium
    if (mod.tier === "premium") {
      sectionMap.get(sectionName)!.tier = "premium";
    }
  }

  return Array.from(sectionMap.values());
}
