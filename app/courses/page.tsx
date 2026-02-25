"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { loadCourses, loadUserCourses } from "@/lib/course-loader";
import type { Course, UserCourseAccess } from "@/lib/types";

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userAccess, setUserAccess] = useState<UserCourseAccess[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase.from("profiles").select("is_internal").eq("id", session.user.id).single();
        setIsInternal(profile?.is_internal || false);
        const access = await loadUserCourses(session.user.id);
        setUserAccess(access);
      }
      const allCourses = await loadCourses();
      setCourses(allCourses);
      setLoading(false);
    }
    init();
  }, []);

  // Filter: show public courses to all, internal courses only to internal users
  const visibleCourses = courses.filter(c =>
    c.visibility === "public" || (c.visibility === "internal" && isInternal)
  );

  function getAccessForCourse(courseId: number) {
    return userAccess.find(a => a.course_id === courseId);
  }

  function formatPrice(cents: number) {
    if (cents === 0) return "Free";
    return `$${(cents / 100).toFixed(0)}`;
  }

  function getStatusBadge(course: Course) {
    const access = getAccessForCourse(course.id);
    if (access?.access_type === "purchased" || access?.access_type === "granted") {
      return { text: "Enrolled", color: "bg-sage/20 text-sage-dark" };
    }
    if (course.price === 0) {
      return { text: "Free", color: "bg-accent/10 text-accent" };
    }
    return { text: formatPrice(course.price), color: "bg-gold/10 text-gold" };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-display font-bold">AgentIQ</span>
            <span className="text-xl font-display text-terra">Hub</span>
          </a>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-white/70">{user.email}</span>
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
                  className="text-sm text-white/60 hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a href="/login?redirect=/courses" className="bg-terra text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-terra-light transition-colors">
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-navy to-navy-light text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Training Courses</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Professional development courses for real estate agents. Master AI tools, sharpen your skills, and stay ahead of the competition.
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {visibleCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">&#128218;</div>
            <h2 className="text-xl font-display font-bold text-navy mb-2">No Courses Available Yet</h2>
            <p className="text-gray-500">Check back soon for new training courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleCourses.map(course => {
              const badge = getStatusBadge(course);
              const access = getAccessForCourse(course.id);
              const isEnrolled = access?.access_type === "purchased" || access?.access_type === "granted" || course.price === 0;

              return (
                <a
                  key={course.id}
                  href={isEnrolled && user ? `/courses/${course.slug}/learn` : `/courses/${course.slug}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                >
                  {/* Course Image or Gradient */}
                  <div className="h-40 bg-gradient-to-br from-navy via-accent to-terra relative">
                    {course.image_url && (
                      <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    {course.visibility === "internal" && (
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                          Internal
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-display font-bold text-navy mb-2 group-hover:text-accent transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {course.short_description || course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        {course.module_count || 0} modules &middot; {course.lesson_count || 0} lessons
                      </div>
                      <span className="text-sm font-semibold text-accent group-hover:text-accent-dark transition-colors">
                        {isEnrolled && user ? "Continue Learning \u2192" : "View Course \u2192"}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
