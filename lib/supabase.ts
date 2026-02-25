import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
export async function saveProgress(userId: string, lessonId: string) {
  const { error } = await supabase
    .from("lesson_progress")
    .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: "user_id,lesson_id" });
  if (error) console.error("Error saving progress:", error);
}

export async function completeModule(userId: string, moduleId: number, quizScore: number) {
  const { error } = await supabase
    .from("module_completions")
    .upsert(
      { user_id: userId, module_id: moduleId, quiz_score: quizScore },
      { onConflict: "user_id,module_id" }
    );
  if (error) console.error("Error completing module:", error);
}

export async function getUserProgress(userId: string) {
  const [{ data: completions }, { data: progress }] = await Promise.all([
    supabase.from("module_completions").select("*").eq("user_id", userId),
    supabase.from("lesson_progress").select("*").eq("user_id", userId),
  ]);
  return { completions: completions || [], progress: progress || [] };
}

export async function getUserProfile(userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

export async function issueCertificate(userId: string, score: number) {
  const { data, error } = await supabase
    .from("certificates")
    .insert({ user_id: userId, score })
    .select()
    .single();
  if (error) console.error("Error issuing certificate:", error);
  return data;
}

// ===== Course Access Helpers =====

export async function enrollInFreeCourse(userId: string, courseId: number) {
  const { error } = await supabase
    .from("user_courses")
    .upsert(
      { user_id: userId, course_id: courseId, access_type: "free" },
      { onConflict: "user_id,course_id" }
    );
  if (error) console.error("Error enrolling in course:", error);
}

export async function getUserCourseAccess(userId: string, courseId: number) {
  const { data } = await supabase
    .from("user_courses")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();
  return data;
}
