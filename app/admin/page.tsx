"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  email: string;
  full_name: string;
  tier: "free" | "premium";
  is_admin: boolean;
  created_at: string;
};

type ModuleCompletion = {
  user_id: string;
  module_id: number;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();

    if (!profile?.is_admin) {
      setLoading(false);
      return;
    }

    setIsAdmin(true);

    // Load all profiles
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    // Load all module completions
    const { data: allCompletions } = await supabase
      .from("module_completions")
      .select("user_id, module_id");

    setProfiles(allProfiles || []);
    setCompletions(allCompletions || []);
    setLoading(false);
  }

  async function toggleTier(userId: string, currentTier: string) {
    setUpdatingUser(userId);
    const newTier = currentTier === "premium" ? "free" : "premium";
    await supabase
      .from("profiles")
      .update({ tier: newTier })
      .eq("id", userId);

    setProfiles(profiles.map(p =>
      p.id === userId ? { ...p, tier: newTier as "free" | "premium" } : p
    ));
    setUpdatingUser(null);
  }

  function getUserCompletions(userId: string) {
    return completions.filter(c => c.user_id === userId).length;
  }

  const filteredProfiles = profiles.filter(p =>
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = profiles.length;
  const premiumUsers = profiles.filter(p => p.tier === "premium").length;
  const freeUsers = totalUsers - premiumUsers;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-display font-bold text-navy mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
          <a href="/dashboard" className="bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-dark transition-colors inline-block">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-display font-bold">AgentIQ</span>
            <span className="text-xl font-display text-terra">Hub</span>
            <span className="bg-terra text-white text-xs font-bold px-3 py-1 rounded-full ml-2">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-white/70 hover:text-white transition-colors">← Back to Course</a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-navy mb-1">{totalUsers}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-gold mb-1">{premiumUsers}</div>
            <div className="text-sm text-gray-500">Premium Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-accent mb-1">{freeUsers}</div>
            <div className="text-sm text-gray-500">Free Users</div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-xl font-display font-bold text-navy">User Management</h2>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-accent w-full md:w-72"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Modules Done</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProfiles.map(profile => (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-navy text-sm">{profile.full_name || "—"}</div>
                      <div className="text-xs text-gray-400">{profile.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        profile.tier === "premium"
                          ? "bg-gold/10 text-gold"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {profile.tier?.toUpperCase() || "FREE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{getUserCompletions(profile.id)} / 17</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleTier(profile.id, profile.tier)}
                        disabled={updatingUser === profile.id}
                        className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                          profile.tier === "premium"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        } ${updatingUser === profile.id ? "opacity-50 cursor-wait" : ""}`}
                      >
                        {updatingUser === profile.id
                          ? "Updating..."
                          : profile.tier === "premium"
                            ? "Downgrade to Free"
                            : "Upgrade to Premium"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProfiles.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              {searchQuery ? "No users match your search." : "No users found."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
