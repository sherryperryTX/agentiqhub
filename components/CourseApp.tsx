"use client";
import { useState, useEffect, useRef } from "react";
import { supabase, getUserCourseAccess, enrollInFreeCourse } from "@/lib/supabase";
import { MODULES as STATIC_MODULES, SECTIONS as STATIC_SECTIONS, type Module, type Lesson } from "@/lib/course-data";
import { loadModules, buildSections, loadCourseBySlug, hasFullAccess } from "@/lib/course-loader";
import type { Course, UserCourseAccess } from "@/lib/types";
import QuizSystem from "./QuizSystem";

type Page = "login" | "signup" | "dashboard" | "lesson" | "quiz";
type User = { id: string; email: string; full_name: string } | null;

interface CourseAppProps {
  courseSlug?: string; // e.g. "ai-mastery" — if omitted, falls back to AI Mastery (legacy behavior)
}

export default function CourseApp({ courseSlug }: CourseAppProps) {
  const [page, setPage] = useState<Page>("login");
  const [user, setUser] = useState<User>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInternal, setIsInternal] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [allModules, setAllModules] = useState<Module[]>(STATIC_MODULES);
  const [allSections, setAllSections] = useState(STATIC_SECTIONS);

  // Course-specific state
  const [course, setCourse] = useState<Course | null>(null);
  const [courseAccess, setCourseAccess] = useState<UserCourseAccess | undefined>(undefined);
  const [hasAccess, setHasAccess] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);

  // Prevent double-loading from getSession + onAuthStateChange both firing
  const dataLoadedRef = useRef(false);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !dataLoadedRef.current) {
        dataLoadedRef.current = true;
        loadUserData(session.user.id, session.user.email || "");
      } else if (!session?.user) {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle actual auth changes, not INITIAL_SESSION or TOKEN_REFRESHED
      // INITIAL_SESSION is handled by getSession() above
      // TOKEN_REFRESHED should NOT reload data (it was causing progress resets on mobile)
      if (event === "SIGNED_IN" && session?.user && !dataLoadedRef.current) {
        dataLoadedRef.current = true;
        loadUserData(session.user.id, session.user.email || "");
      } else if (event === "SIGNED_OUT") {
        dataLoadedRef.current = false;
        setUser(null);
        setPage("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserData(userId: string, email: string) {
    // Get or create profile
    let { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (!profile) {
      await supabase.from("profiles").insert({ id: userId, email, full_name: fullName || email.split("@")[0] });
      profile = { id: userId, email, full_name: fullName || email.split("@")[0], tier: "free", is_internal: false };
    }

    setUser({ id: userId, email, full_name: profile.full_name || "" });
    setIsAdmin(profile.is_admin || false);
    setIsInternal(profile.is_internal || false);

    // Load course data
    let loadedCourse: Course | null = null;
    if (courseSlug) {
      loadedCourse = await loadCourseBySlug(courseSlug);
    }

    if (loadedCourse) {
      setCourse(loadedCourse);

      // Check course access
      const access = await getUserCourseAccess(userId, loadedCourse.id);
      setCourseAccess(access || undefined);

      const fullAccess = hasFullAccess(loadedCourse, access || undefined, profile.is_internal || false);
      setHasAccess(fullAccess);

      // If free course, auto-enroll
      if (loadedCourse.price === 0 && !access) {
        await enrollInFreeCourse(userId, loadedCourse.id);
        setCourseAccess({ id: 0, user_id: userId, course_id: loadedCourse.id, access_type: "free" });
        setHasAccess(true);
      }

      // Load modules for this course
      const modules = await loadModules(loadedCourse.id);
      setAllModules(modules);
      setAllSections(buildSections(modules));
    } else {
      // Legacy behavior: load all modules (AI Mastery fallback)
      const modules = await loadModules();
      setAllModules(modules);
      setAllSections(buildSections(modules));
      // Legacy: use tier-based access
      setHasAccess(profile.tier === "premium");
    }

    // Load progress — use Promise.all to load in parallel, and protect against null/error responses
    const [completionsRes, progressRes] = await Promise.all([
      supabase.from("module_completions").select("module_id").eq("user_id", userId),
      supabase.from("lesson_progress").select("lesson_id").eq("user_id", userId),
    ]);

    // Only update state if we got valid data — never overwrite with empty on error
    if (completionsRes.data) {
      setCompletedModules(completionsRes.data.map((c: any) => c.module_id));
    }
    if (progressRes.data) {
      setCompletedLessons(progressRes.data.map((p: any) => p.lesson_id));
    }

    setPage("dashboard");
    setLoading(false);
  }

  async function handleSignUp() {
    setAuthError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setAuthError(error.message); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, email, full_name: fullName });
      setAuthError("Check your email for a confirmation link!");
    }
  }

  async function handleLogin() {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setPage("login");
  }

  async function markLessonComplete(lessonId: string) {
    if (!user) return;
    // Use functional updater to avoid stale closure issues
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      // Save to database (fire and forget with error logging)
      supabase.from("lesson_progress").upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: "user_id,lesson_id" })
        .then(({ error }) => { if (error) console.error("Error saving lesson progress:", error); });
      return [...prev, lessonId];
    });
  }

  async function handleQuizComplete(moduleId: number, score: number, passed: boolean) {
    if (!user || !passed) return;
    await supabase.from("module_completions").upsert(
      { user_id: user.id, module_id: moduleId, quiz_score: score },
      { onConflict: "user_id,module_id" }
    );
    // Use functional updater to avoid stale closure issues
    setCompletedModules(prev => {
      if (prev.includes(moduleId)) return prev;
      return [...prev, moduleId];
    });
  }

  async function handleUpgrade() {
    if (!user) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          courseId: course?.id,
          courseSlug: course?.slug,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Upgrade error:", err);
    }
  }

  // Format price from cents
  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(0)}`;
  }

  const courseTitle = course?.title || "AI Mastery for Real Estate";
  const coursePrice = course?.price ?? 19700;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading {courseTitle}...</p>
        </div>
      </div>
    );
  }

  // ===== AUTH PAGES =====
  if (page === "login" || page === "signup") {
    const isSignup = page === "signup";
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-navy">
              <span>AgentIQ</span> <span className="text-terra">Hub</span>
            </h1>
            <p className="text-gray-500 mt-2">{isSignup ? "Create your account" : "Welcome back"}</p>
            {course && (
              <p className="text-sm text-accent mt-1">{courseTitle}</p>
            )}
          </div>

          {authError && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${authError.includes("Check your email") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {authError}
            </div>
          )}

          <div className="space-y-4">
            {isSignup && (
              <input
                type="text" placeholder="Full Name" value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
              />
            )}
            <input
              type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent"
            />
            <button
              onClick={isSignup ? handleSignUp : handleLogin}
              className="w-full bg-navy text-white py-3 rounded-xl font-semibold hover:bg-navy-dark transition-colors"
            >
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setPage(isSignup ? "login" : "signup"); setAuthError(""); }} className="text-accent font-semibold hover:underline">
              {isSignup ? "Sign In" : "Sign Up Free"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ===== QUIZ PAGE =====
  if (page === "quiz" && currentModule) {
    return (
      <QuizSystem
        moduleId={currentModule.id}
        moduleName={currentModule.title}
        questions={currentModule.quiz}
        onComplete={(score, passed) => {
          handleQuizComplete(currentModule.id, score, passed);
          setPage("dashboard");
        }}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  // ===== LESSON PAGE =====
  if (page === "lesson" && currentModule && currentLesson) {
    const lessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);
    const prevLesson = lessonIndex > 0 ? currentModule.lessons[lessonIndex - 1] : null;
    const nextLesson = lessonIndex < currentModule.lessons.length - 1 ? currentModule.lessons[lessonIndex + 1] : null;

    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setPage("dashboard")} className="text-accent hover:underline">← Back to Dashboard</button>
            <span className="text-sm text-gray-500">Module {currentModule.id}: {currentModule.title}</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Lesson navigation */}
          <div className="flex gap-2 mb-8">
            {currentModule.lessons.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setCurrentLesson(l)}
                className={`flex-1 h-2 rounded-full transition-colors ${l.id === currentLesson.id ? "bg-accent" : completedLessons.includes(l.id) ? "bg-sage" : "bg-gray-200"}`}
              />
            ))}
          </div>

          <h1 className="text-3xl font-display font-bold text-navy mb-6">{currentLesson.title}</h1>

          <div className="prose bg-white rounded-xl p-8 shadow-sm mb-8">
            {currentLesson.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{
                __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
            ))}
          </div>

          {/* Handout download */}
          {currentLesson.handoutUrl && (
            <div className="bg-white rounded-xl p-5 shadow-sm mb-8 flex items-center justify-between border-2 border-accent/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">&#128196;</span>
                <div>
                  <div className="font-semibold text-navy text-sm">{currentLesson.handoutName || "Lesson Handout"}</div>
                  <div className="text-xs text-gray-400">Downloadable resource for this lesson</div>
                </div>
              </div>
              <a
                href={currentLesson.handoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Download
              </a>
            </div>
          )}

          <div className="flex items-center justify-between">
            {prevLesson ? (
              <button onClick={() => setCurrentLesson(prevLesson)} className="text-accent hover:underline">← {prevLesson.title}</button>
            ) : <div />}

            <button
              onClick={() => {
                markLessonComplete(currentLesson.id);
                if (nextLesson) {
                  setCurrentLesson(nextLesson);
                } else {
                  // All lessons done, go to quiz
                  setPage("quiz");
                }
              }}
              className="bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-dark transition-colors"
            >
              {nextLesson ? "Complete & Continue →" : "Complete & Take Quiz →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  // Access logic: if course loaded, use hasAccess state; if legacy, check tier
  const isModuleLocked = (mod: Module): boolean => {
    if (hasAccess) return false; // Full access to all modules
    if (course) {
      // Paid course without access — all modules locked
      return course.price > 0;
    }
    // Legacy tier-based: premium modules locked for free users
    return mod.tier === "premium";
  };

  const accessibleModules = allModules.filter(m => !isModuleLocked(m));
  const totalModules = hasAccess ? allModules.length : accessibleModules.length;
  const accessibleModuleIds = hasAccess ? allModules.map(m => m.id) : accessibleModules.map(m => m.id);
  const progress = totalModules > 0 ? Math.round((completedModules.filter(id => accessibleModuleIds.includes(id)).length / totalModules) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-display font-bold text-navy">AgentIQ</span>
              <span className="text-xl font-display text-terra">Hub</span>
            </div>
            {course && (
              <>
                <span className="text-gray-300">|</span>
                <a href="/courses" className="text-sm text-accent hover:underline">← All Courses</a>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {user?.full_name || user?.email}</span>
            {hasAccess && coursePrice > 0 && (
              <span className="bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">ENROLLED</span>
            )}
            {isAdmin && (
              <a href="/admin" className="bg-terra text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-terra-dark transition-colors">ADMIN</a>
            )}
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600">Sign Out</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Course Title */}
        {course && (
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-navy">{courseTitle}</h1>
            {course.short_description && (
              <p className="text-gray-500 mt-1">{course.short_description}</p>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-navy">Your Progress</h2>
            <span className="text-sm text-gray-500">{completedModules.filter(id => accessibleModuleIds.includes(id)).length} of {totalModules} modules complete</span>
          </div>
          <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-accent to-sage h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Upgrade Banner — show when course is paid and user doesn't have access */}
        {!hasAccess && coursePrice > 0 && (
          <div className="bg-navy rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-xl mb-1">Unlock All {allModules.length} Modules + Certification</h3>
              <p className="text-white/70">Get full access to {courseTitle} with all lessons, quizzes, and your professional certificate.</p>
            </div>
            <button onClick={handleUpgrade} className="bg-terra px-8 py-3 rounded-xl font-semibold hover:bg-terra-dark transition-colors whitespace-nowrap">
              Purchase — {formatPrice(coursePrice)}
            </button>
          </div>
        )}

        {/* Modules by Section */}
        {allSections.map(sec => (
          <div key={sec.name} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-display font-bold text-navy">{sec.name}</h3>
              {!hasAccess && coursePrice > 0 && (
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sec.tier === "premium" ? "bg-gold/10 text-gold" : "bg-accent/10 text-accent"}`}>
                  {sec.tier === "premium" ? "PREMIUM" : "FREE"}
                </span>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sec.modules.map(modId => {
                const mod = allModules.find(m => m.id === modId)!;
                if (!mod) return null;
                const locked = isModuleLocked(mod);
                const isComplete = completedModules.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      if (locked) return;
                      setCurrentModule(mod);
                      setCurrentLesson(mod.lessons[0]);
                      setPage("lesson");
                    }}
                    className={`bg-white rounded-xl p-5 border-2 transition-all ${
                      locked ? "border-gray-100 opacity-60 cursor-not-allowed" :
                      isComplete ? "border-sage cursor-pointer hover:shadow-md" :
                      "border-gray-100 cursor-pointer hover:border-accent hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-400">Module {mod.id}</span>
                      {locked && <span className="text-gray-400">🔒</span>}
                      {isComplete && <span className="text-sage">✓</span>}
                    </div>
                    <h4 className="font-semibold text-navy text-sm mb-2">{mod.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{mod.description}</p>
                    <div className="mt-3 text-xs text-gray-400">
                      {mod.lessons.length} lessons · {mod.quiz.length} quiz questions
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
