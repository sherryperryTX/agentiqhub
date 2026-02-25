"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/courses";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // If already logged in, redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push(redirectTo);
      } else {
        setCheckingSession(false);
      }
    });
  }, [redirectTo, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectTo);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName || email.split("@")[0],
      });
      router.push(redirectTo);
    }
  }

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-display font-bold text-navy text-center mb-2">
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          {mode === "login"
            ? "Sign in to access your courses and continue learning."
            : "Sign up to start your real estate training journey."}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-6">{error}</div>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-navy mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-navy"
                placeholder="Your full name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-navy"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-navy"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terra text-white font-semibold py-3 rounded-xl hover:bg-terra-light transition-colors disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => { setMode("signup"); setError(""); }} className="text-accent font-semibold hover:underline">
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="text-accent font-semibold hover:underline">
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-display font-bold">AgentIQ</span>
            <span className="text-xl font-display text-terra">Hub</span>
          </a>
          <a href="/courses" className="text-sm text-white/70 hover:text-white">&larr; Browse Courses</a>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
