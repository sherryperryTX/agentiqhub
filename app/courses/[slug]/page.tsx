"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { loadCourseBySlug, loadModules, loadUserCourses, hasFullAccess, buildSections } from "@/lib/course-loader";
import { enrollInFreeCourse } from "@/lib/supabase";
import type { Course, UserCourseAccess } from "@/lib/types";
import type { Module } from "@/lib/course-data";

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userAccess, setUserAccess] = useState<UserCourseAccess | undefined>();
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function init() {
      const courseData = await loadCourseBySlug(slug);
      if (!courseData) { setLoading(false); return; }
      setCourse(courseData);

      const courseModules = await loadModules(courseData.id);
      setModules(courseModules);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase.from("profiles").select("is_internal").eq("id", session.user.id).single();
        setIsInternal(profile?.is_internal || false);
        const allAccess = await loadUserCourses(session.user.id);
        setUserAccess(allAccess.find(a => a.course_id === courseData.id));
      }
      setLoading(false);
    }
    init();
  }, [slug]);

  async function handleEnrollFree() {
    if (!user || !course) return;
    setEnrolling(true);
    await enrollInFreeCourse(user.id, course.id);
    router.push(`/courses/${slug}/learn`);
  }

  async function handlePurchase() {
    if (!user || !course) return;
    setEnrolling(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userEmail: user.email, courseId: course.id, courseSlug: slug }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Checkout failed");
    } catch (err: any) {
      alert("Error: " + err.message);
      setEnrolling(false);
    }
  }

  function formatPrice(cents: number) {
    return cents === 0 ? "Free" : `$${(cents / 100).toFixed(0)}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-5xl mb-4">&#128533;</div>
          <h1 className="text-2xl font-display font-bold text-navy mb-2">Course Not Found</h1>
          <p className="text-gray-500 mb-6">This course doesn&apos;t exist or isn&apos;t available.</p>
          <a href="/courses" className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-dark transition-colors inline-block">Browse Courses</a>
        </div>
      </div>
    );
  }

  const isEnrolled = hasFullAccess(course, userAccess, isInternal);
  const sections = buildSections(modules);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-display font-bold">AgentIQ</span>
            <span className="text-xl font-display text-terra">Hub</span>
          </a>
          <a href="/courses" className="text-sm text-white/70 hover:text-white">&larr; All Courses</a>
        </div>
      </div>

      {/* Course Hero */}
      <div className="bg-gradient-to-b from-navy to-navy-light text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${course.price === 0 ? "bg-accent/20 text-accent-light" : "bg-gold/20 text-gold-light"}`}>
              {formatPrice(course.price)}
            </span>
            {course.visibility === "internal" && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">Internal</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-white/70 mb-8 max-w-2xl">{course.description}</p>

          <div className="flex items-center gap-4 flex-wrap">
            {!user ? (
              <a href={`/login?redirect=/courses/${slug}`} className="bg-terra text-white font-semibold px-8 py-3 rounded-xl hover:bg-terra-light transition-colors">
                Sign In to Enroll
              </a>
            ) : isEnrolled ? (
              <a href={`/courses/${slug}/learn`} className="bg-terra text-white font-semibold px-8 py-3 rounded-xl hover:bg-terra-light transition-colors">
                Continue Learning
              </a>
            ) : course.price === 0 ? (
              <button onClick={handleEnrollFree} disabled={enrolling} className="bg-terra text-white font-semibold px-8 py-3 rounded-xl hover:bg-terra-light transition-colors disabled:opacity-50">
                {enrolling ? "Enrolling..." : "Enroll Free"}
              </button>
            ) : (
              <button onClick={handlePurchase} disabled={enrolling} className="bg-terra text-white font-semibold px-8 py-3 rounded-xl hover:bg-terra-light transition-colors disabled:opacity-50">
                {enrolling ? "Processing..." : `Purchase — ${formatPrice(course.price)}`}
              </button>
            )}
            <div className="text-sm text-white/50">
              {modules.length} modules &middot; {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Preview */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-display font-bold text-navy mb-8">Course Curriculum</h2>

        {sections.map((section, si) => (
          <div key={si} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-display font-bold text-navy">{section.name}</h3>
              {!isEnrolled && section.tier === "premium" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/10 text-gold">PAID</span>
              )}
            </div>
            <div className="space-y-2">
              {modules
                .filter(m => section.modules.includes(m.id))
                .map(mod => (
                  <div key={mod.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-navy">{mod.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{mod.lessons.length} lessons &middot; {mod.quiz.length} quiz questions</div>
                    </div>
                    {!isEnrolled && section.tier === "premium" && (
                      <span className="text-gray-300 text-lg">&#128274;</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
