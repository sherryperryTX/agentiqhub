"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// ===== Types =====
type Profile = { id: string; email: string; full_name: string; tier: "free" | "premium"; is_admin: boolean; created_at: string };
type ModuleCompletion = { user_id: string; module_id: number };
type DBModule = { id: number; title: string; section: string; description: string; tier: string; sort_order: number };
type DBLesson = { id: string; module_id: number; title: string; content: string; video_url: string | null; handout_url: string | null; handout_name: string | null; sort_order: number };
type DBQuiz = { id: number; module_id: number; question: string; options: string[]; correct_index: number; sort_order: number };
type ChatMessage = { role: "user" | "assistant"; content: string };
type Tab = "users" | "content" | "ai";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [authToken, setAuthToken] = useState("");

  // User management
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [completions, setCompletions] = useState<ModuleCompletion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  // Content management
  const [modules, setModules] = useState<DBModule[]>([]);
  const [lessons, setLessons] = useState<DBLesson[]>([]);
  const [quizzes, setQuizzes] = useState<DBQuiz[]>([]);
  const [selectedModule, setSelectedModule] = useState<DBModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<DBLesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<DBQuiz | null>(null);
  const [showNewModule, setShowNewModule] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState(false);
  const [showNewQuiz, setShowNewQuiz] = useState(false);
  const [saving, setSaving] = useState(false);

  // New module form
  const [newModule, setNewModule] = useState({ title: "", section: "", description: "", tier: "premium" });
  // New lesson form
  const [newLesson, setNewLesson] = useState({ title: "", content: "", video_url: "", handout_url: "", handout_name: "" });
  // New quiz form
  const [newQuiz, setNewQuiz] = useState({ question: "", options: ["", "", "", ""], correct_index: 0 });

  // AI chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);
  const [generateTopic, setGenerateTopic] = useState("");
  const [generateTier, setGenerateTier] = useState("premium");
  const [generateSection, setGenerateSection] = useState("");
  // Document upload
  const [docContent, setDocContent] = useState("");
  const [docModuleName, setDocModuleName] = useState("");
  const [docSection, setDocSection] = useState("");
  const [docTier, setDocTier] = useState("premium");
  const [docInstructions, setDocInstructions] = useState("");
  const [docFileName, setDocFileName] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { checkAdminAndLoad(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  async function checkAdminAndLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { setLoading(false); return; }

    setAuthToken(session.access_token);

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single();
    if (!profile?.is_admin) { setLoading(false); return; }
    setIsAdmin(true);

    // Load all data in parallel
    const [profilesRes, completionsRes, modulesRes, lessonsRes, quizzesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("module_completions").select("user_id, module_id"),
      supabase.from("course_modules").select("*").order("sort_order"),
      supabase.from("course_lessons").select("*").order("sort_order"),
      supabase.from("course_quizzes").select("*").order("sort_order"),
    ]);

    setProfiles(profilesRes.data || []);
    setCompletions(completionsRes.data || []);
    setModules(modulesRes.data || []);
    setLessons(lessonsRes.data || []);
    setQuizzes(quizzesRes.data || []);
    setLoading(false);
  }

  // ===== AI Functions =====
  async function callAI(action: string, context: any) {
    const res = await fetch("/api/ai-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
      body: JSON.stringify({ action, context }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(errorData.error || `AI request failed (${res.status})`);
    }
    return res.json();
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const updatedMessages = [...chatMessages, { role: "user" as const, content: userMsg }];
    setChatMessages(updatedMessages);
    setAiLoading(true);
    try {
      // Send full conversation history so AI has context of the planning discussion
      const result = await callAI("chat", { message: userMsg, history: chatMessages });
      setChatMessages(prev => [...prev, { role: "assistant", content: result.text }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please check that the Anthropic API key is configured in Vercel." }]);
    }
    setAiLoading(false);
  }

  async function aiGenerateModule() {
    if (!generateTopic.trim()) return;
    setAiGenerating("module");
    try {
      const result = await callAI("generate_module", { topic: generateTopic, tier: generateTier, section: generateSection });
      if (result.parsed) {
        const mod = result.parsed;
        // Save module to database
        const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.sort_order)) + 1 : 1;
        const { data: newMod, error: modErr } = await supabase.from("course_modules")
          .insert({ title: mod.title, section: mod.section || generateSection, description: mod.description, tier: mod.tier || generateTier, sort_order: nextOrder })
          .select().single();

        if (modErr || !newMod) throw new Error(modErr?.message || "Failed to save module");

        // Save lessons
        for (let i = 0; i < mod.lessons.length; i++) {
          const l = mod.lessons[i];
          await supabase.from("course_lessons").insert({
            id: `${newMod.id}-${i + 1}`,
            module_id: newMod.id,
            title: l.title,
            content: l.content,
            sort_order: i + 1,
          });
        }

        // Save quizzes
        for (let i = 0; i < mod.quiz.length; i++) {
          const q = mod.quiz[i];
          await supabase.from("course_quizzes").insert({
            module_id: newMod.id,
            question: q.question,
            options: q.options,
            correct_index: q.correct,
            sort_order: i + 1,
          });
        }

        // Refresh data
        await refreshContent();
        setChatMessages(prev => [...prev, {
          role: "assistant",
          content: `I've created a new module: **${mod.title}**\n\nIt includes ${mod.lessons.length} lessons and ${mod.quiz.length} quiz questions. You can find it in the Content tab to review and edit.`
        }]);
        setGenerateTopic("");
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: result.text }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    }
    setAiGenerating(null);
  }

  async function aiGenerateLesson(moduleId: number, moduleName: string) {
    const topic = prompt("What should this lesson cover?");
    if (!topic) return;
    setAiGenerating("lesson");
    try {
      const result = await callAI("generate_lesson", { topic, moduleName });
      if (result.parsed) {
        const l = result.parsed;
        const moduleLessons = lessons.filter(les => les.module_id === moduleId);
        const nextOrder = moduleLessons.length + 1;
        await supabase.from("course_lessons").insert({
          id: `${moduleId}-${nextOrder}`,
          module_id: moduleId,
          title: l.title,
          content: l.content,
          sort_order: nextOrder,
        });
        await refreshContent();
        setChatMessages(prev => [...prev, { role: "assistant", content: `Created new lesson: **${l.title}** in module "${moduleName}"` }]);
      }
    } catch (err: any) {
      alert("Error generating lesson: " + err.message);
    }
    setAiGenerating(null);
  }

  async function aiGenerateQuizzes(moduleId: number, moduleName: string) {
    setAiGenerating("quiz");
    try {
      const moduleLessons = lessons.filter(l => l.module_id === moduleId);
      const topicSummary = moduleLessons.map(l => l.title).join(", ");
      const result = await callAI("generate_quiz", { topic: topicSummary, moduleName, count: 5 });
      if (result.parsed?.questions) {
        const moduleQuizzes = quizzes.filter(q => q.module_id === moduleId);
        let nextOrder = moduleQuizzes.length + 1;
        for (const q of result.parsed.questions) {
          await supabase.from("course_quizzes").insert({
            module_id: moduleId,
            question: q.question,
            options: q.options,
            correct_index: q.correct,
            sort_order: nextOrder++,
          });
        }
        await refreshContent();
        setChatMessages(prev => [...prev, { role: "assistant", content: `Added ${result.parsed.questions.length} quiz questions to "${moduleName}"` }]);
      }
    } catch (err: any) {
      alert("Error generating quizzes: " + err.message);
    }
    setAiGenerating(null);
  }

  async function aiImproveLesson(lesson: DBLesson) {
    const instructions = prompt("Any specific improvements you want? (Leave blank for general improvement)");
    setAiGenerating("improve");
    try {
      const result = await callAI("improve_content", { title: lesson.title, content: lesson.content, instructions: instructions || "" });
      if (result.parsed) {
        await supabase.from("course_lessons")
          .update({ title: result.parsed.title, content: result.parsed.content })
          .eq("id", lesson.id);
        await refreshContent();
        setChatMessages(prev => [...prev, { role: "assistant", content: `Improved lesson: **${result.parsed.title}**` }]);
      }
    } catch (err: any) {
      alert("Error improving content: " + err.message);
    }
    setAiGenerating(null);
  }

  async function aiVideoScript(lesson: DBLesson, moduleName: string) {
    setAiGenerating("video");
    try {
      const result = await callAI("generate_video_script", {
        lessonTitle: lesson.title,
        moduleName,
        lessonContent: lesson.content,
      });
      if (result.parsed) {
        setChatMessages(prev => [...prev, {
          role: "assistant",
          content: `**Video Script: ${result.parsed.title}**\n*Duration: ${result.parsed.duration}*\n\n${result.parsed.script}`
        }]);
        setActiveTab("ai");
      }
    } catch (err: any) {
      alert("Error generating video script: " + err.message);
    }
    setAiGenerating(null);
  }

  // ===== Document Upload =====
  const [docParsing, setDocParsing] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFileName(file.name);
    // Auto-fill module name from file name
    if (!docModuleName) {
      const nameWithoutExt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setDocModuleName(nameWithoutExt);
    }

    const fileName = file.name.toLowerCase();
    // For plain text files, read directly in browser
    if (fileName.endsWith(".txt") || fileName.endsWith(".md") || fileName.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDocContent(text || "");
      };
      reader.readAsText(file);
      return;
    }

    // For PDF, DOCX, DOC — send to server for parsing
    setDocParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-document", {
        method: "POST",
        headers: { "Authorization": `Bearer ${authToken}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || "Failed to parse file");
      }
      const result = await res.json();
      setDocContent(result.text);
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: `Parsed **${file.name}** successfully (${result.charCount.toLocaleString()} characters extracted). You can now click "Create Module from Document" to generate a training module from it.`
      }]);
    } catch (err: any) {
      alert("Error parsing file: " + err.message);
      setDocFileName("");
    }
    setDocParsing(false);
  }

  async function aiGenerateFromDocument() {
    if (!docContent.trim()) { alert("Please upload a document or paste content first."); return; }
    setAiGenerating("document");
    try {
      const result = await callAI("generate_from_document", {
        documentContent: docContent,
        moduleName: docModuleName,
        section: docSection,
        tier: docTier,
        instructions: docInstructions,
      });
      if (result.parsed) {
        const mod = result.parsed;
        const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.sort_order)) + 1 : 1;
        const { data: newMod, error: modErr } = await supabase.from("course_modules")
          .insert({ title: mod.title, section: mod.section || docSection || "Custom Training", description: mod.description, tier: mod.tier || docTier, sort_order: nextOrder })
          .select().single();

        if (modErr || !newMod) throw new Error(modErr?.message || "Failed to save module");

        for (let i = 0; i < mod.lessons.length; i++) {
          const l = mod.lessons[i];
          await supabase.from("course_lessons").insert({
            id: `${newMod.id}-${i + 1}`,
            module_id: newMod.id,
            title: l.title,
            content: l.content,
            sort_order: i + 1,
          });
        }

        for (let i = 0; i < mod.quiz.length; i++) {
          const q = mod.quiz[i];
          await supabase.from("course_quizzes").insert({
            module_id: newMod.id,
            question: q.question,
            options: q.options,
            correct_index: q.correct,
            sort_order: i + 1,
          });
        }

        await refreshContent();
        setChatMessages(prev => [...prev, {
          role: "assistant",
          content: `I created a new module from your document: **${mod.title}**\n\nIt has ${mod.lessons.length} lessons and ${mod.quiz.length} quiz questions. Check the Content tab to review and edit.`
        }]);
        // Reset form
        setDocContent(""); setDocModuleName(""); setDocInstructions(""); setDocFileName("");
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: result.text }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    }
    setAiGenerating(null);
  }

  // ===== CRUD Functions =====
  async function refreshContent() {
    const [modulesRes, lessonsRes, quizzesRes] = await Promise.all([
      supabase.from("course_modules").select("*").order("sort_order"),
      supabase.from("course_lessons").select("*").order("sort_order"),
      supabase.from("course_quizzes").select("*").order("sort_order"),
    ]);
    setModules(modulesRes.data || []);
    setLessons(lessonsRes.data || []);
    setQuizzes(quizzesRes.data || []);
  }

  async function saveNewModule() {
    if (!newModule.title.trim()) return;
    setSaving(true);
    const nextOrder = modules.length > 0 ? Math.max(...modules.map(m => m.sort_order)) + 1 : 1;
    await supabase.from("course_modules").insert({ ...newModule, sort_order: nextOrder });
    await refreshContent();
    setNewModule({ title: "", section: "", description: "", tier: "premium" });
    setShowNewModule(false);
    setSaving(false);
  }

  async function updateModule(mod: DBModule) {
    setSaving(true);
    await supabase.from("course_modules").update({ title: mod.title, section: mod.section, description: mod.description, tier: mod.tier }).eq("id", mod.id);
    await refreshContent();
    setSaving(false);
  }

  async function deleteModule(id: number) {
    if (!confirm("Delete this module and ALL its lessons and quizzes? This cannot be undone.")) return;
    await supabase.from("course_modules").delete().eq("id", id);
    await refreshContent();
    if (selectedModule?.id === id) setSelectedModule(null);
  }

  async function saveNewLesson() {
    if (!selectedModule || !newLesson.title.trim()) return;
    setSaving(true);
    const moduleLessons = lessons.filter(l => l.module_id === selectedModule.id);
    const nextOrder = moduleLessons.length + 1;
    await supabase.from("course_lessons").insert({
      id: `${selectedModule.id}-${nextOrder}`,
      module_id: selectedModule.id,
      title: newLesson.title,
      content: newLesson.content,
      video_url: newLesson.video_url || null,
      handout_url: newLesson.handout_url || null,
      handout_name: newLesson.handout_name || null,
      sort_order: nextOrder,
    });
    await refreshContent();
    setNewLesson({ title: "", content: "", video_url: "", handout_url: "", handout_name: "" });
    setShowNewLesson(false);
    setSaving(false);
  }

  async function updateLesson(lesson: DBLesson) {
    setSaving(true);
    await supabase.from("course_lessons").update({ title: lesson.title, content: lesson.content, video_url: lesson.video_url, handout_url: lesson.handout_url, handout_name: lesson.handout_name }).eq("id", lesson.id);
    await refreshContent();
    setEditingLesson(null);
    setSaving(false);
  }

  async function deleteLesson(id: string) {
    if (!confirm("Delete this lesson?")) return;
    await supabase.from("course_lessons").delete().eq("id", id);
    await refreshContent();
  }

  async function saveNewQuiz() {
    if (!selectedModule || !newQuiz.question.trim()) return;
    setSaving(true);
    const moduleQuizzes = quizzes.filter(q => q.module_id === selectedModule.id);
    const nextOrder = moduleQuizzes.length + 1;
    await supabase.from("course_quizzes").insert({
      module_id: selectedModule.id,
      question: newQuiz.question,
      options: newQuiz.options,
      correct_index: newQuiz.correct_index,
      sort_order: nextOrder,
    });
    await refreshContent();
    setNewQuiz({ question: "", options: ["", "", "", ""], correct_index: 0 });
    setShowNewQuiz(false);
    setSaving(false);
  }

  async function updateQuiz(quiz: DBQuiz) {
    setSaving(true);
    await supabase.from("course_quizzes").update({ question: quiz.question, options: quiz.options, correct_index: quiz.correct_index }).eq("id", quiz.id);
    await refreshContent();
    setEditingQuiz(null);
    setSaving(false);
  }

  async function deleteQuiz(id: number) {
    if (!confirm("Delete this quiz question?")) return;
    await supabase.from("course_quizzes").delete().eq("id", id);
    await refreshContent();
  }

  // User management
  async function toggleTier(userId: string, currentTier: string) {
    setUpdatingUser(userId);
    const newTier = currentTier === "premium" ? "free" : "premium";
    await supabase.from("profiles").update({ tier: newTier }).eq("id", userId);
    setProfiles(profiles.map(p => p.id === userId ? { ...p, tier: newTier as "free" | "premium" } : p));
    setUpdatingUser(null);
  }

  async function toggleAdmin(userId: string, currentIsAdmin: boolean) {
    if (currentIsAdmin) {
      if (!confirm("Remove admin privileges from this user? They will no longer be able to access the admin dashboard.")) return;
    } else {
      if (!confirm("Grant admin privileges to this user? They will be able to manage all course content and users.")) return;
    }
    setUpdatingUser(userId);
    await supabase.from("profiles").update({ is_admin: !currentIsAdmin }).eq("id", userId);
    setProfiles(profiles.map(p => p.id === userId ? { ...p, is_admin: !currentIsAdmin } : p));
    setUpdatingUser(null);
  }

  function getUserCompletions(userId: string) { return completions.filter(c => c.user_id === userId).length; }

  const filteredProfiles = profiles.filter(p =>
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===== Rendering =====
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
          <div className="text-5xl mb-4">&#128274;</div>
          <h1 className="text-2xl font-display font-bold text-navy mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You need admin privileges to access this page.</p>
          <a href="/dashboard" className="bg-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-navy-dark transition-colors inline-block">Back to Dashboard</a>
        </div>
      </div>
    );
  }

  const moduleLessons = selectedModule ? lessons.filter(l => l.module_id === selectedModule.id) : [];
  const moduleQuizzes = selectedModule ? quizzes.filter(q => q.module_id === selectedModule.id) : [];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-display font-bold">AgentIQ</span>
            <span className="text-xl font-display text-terra">Hub</span>
            <span className="bg-terra text-white text-xs font-bold px-3 py-1 rounded-full ml-2">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-white/70 hover:text-white transition-colors">&larr; Back to Course</a>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {([
            { id: "content" as Tab, label: "Content Manager", icon: "&#128218;" },
            { id: "ai" as Tab, label: "AI Assistant", icon: "&#129302;" },
            { id: "users" as Tab, label: "Users", icon: "&#128101;" },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              dangerouslySetInnerHTML={{ __html: `${tab.icon} ${tab.label}` }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ========== CONTENT TAB ========== */}
        {activeTab === "content" && (
          <div className="flex gap-6">
            {/* Module list */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-display font-bold text-navy">Modules</h2>
                  <button onClick={() => setShowNewModule(true)} className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-accent/90">+ New</button>
                </div>

                {showNewModule && (
                  <div className="p-4 bg-accent/5 border-b">
                    <input placeholder="Module title" value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                    <input placeholder="Section name" value={newModule.section} onChange={e => setNewModule({ ...newModule, section: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                    <input placeholder="Description" value={newModule.description} onChange={e => setNewModule({ ...newModule, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                    <select value={newModule.tier} onChange={e => setNewModule({ ...newModule, tier: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-3">
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={saveNewModule} disabled={saving} className="bg-accent text-white text-xs px-3 py-1.5 rounded-lg">{saving ? "Saving..." : "Save"}</button>
                      <button onClick={() => setShowNewModule(false)} className="text-gray-500 text-xs px-3 py-1.5">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  {modules.map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => { setSelectedModule(mod); setEditingLesson(null); setEditingQuiz(null); }}
                      className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 transition-colors ${selectedModule?.id === mod.id ? "bg-accent/5 border-l-4 border-l-accent" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Module {mod.sort_order}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mod.tier === "premium" ? "bg-gold/10 text-gold" : "bg-accent/10 text-accent"}`}>
                          {mod.tier.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-navy mt-1">{mod.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {lessons.filter(l => l.module_id === mod.id).length} lessons &middot; {quizzes.filter(q => q.module_id === mod.id).length} quizzes
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Module detail */}
            <div className="flex-1 min-w-0">
              {selectedModule ? (
                <div>
                  {/* Module header */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <input
                          value={selectedModule.title}
                          onChange={e => setSelectedModule({ ...selectedModule, title: e.target.value })}
                          className="text-xl font-display font-bold text-navy border-b border-transparent hover:border-gray-200 focus:border-accent focus:outline-none w-full pb-1"
                        />
                        <div className="flex gap-3 mt-3">
                          <input value={selectedModule.section} onChange={e => setSelectedModule({ ...selectedModule, section: e.target.value })} placeholder="Section" className="text-sm px-3 py-1.5 border rounded-lg w-48" />
                          <select value={selectedModule.tier} onChange={e => setSelectedModule({ ...selectedModule, tier: e.target.value })} className="text-sm px-3 py-1.5 border rounded-lg">
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                          </select>
                        </div>
                        <textarea
                          value={selectedModule.description}
                          onChange={e => setSelectedModule({ ...selectedModule, description: e.target.value })}
                          rows={2}
                          className="w-full mt-3 text-sm text-gray-600 px-3 py-2 border rounded-lg resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateModule(selectedModule)} className="bg-accent text-white text-xs font-semibold px-4 py-2 rounded-lg">Save</button>
                        <button onClick={() => deleteModule(selectedModule.id)} className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-lg">Delete</button>
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-navy">Lessons ({moduleLessons.length})</h3>
                      <div className="flex gap-2">
                        <button onClick={() => aiGenerateLesson(selectedModule.id, selectedModule.title)} disabled={aiGenerating !== null}
                          className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-100 disabled:opacity-50">
                          {aiGenerating === "lesson" ? "Generating..." : "AI Generate"}
                        </button>
                        <button onClick={() => setShowNewLesson(true)} className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg">+ Add Lesson</button>
                      </div>
                    </div>

                    {showNewLesson && (
                      <div className="bg-accent/5 rounded-xl p-4 mb-4">
                        <input placeholder="Lesson title" value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                        <textarea placeholder="Lesson content (supports **bold** formatting)" value={newLesson.content} onChange={e => setNewLesson({ ...newLesson, content: e.target.value })} rows={6} className="w-full px-3 py-2 border rounded-lg text-sm mb-2 font-mono" />
                        <input placeholder="Video URL (optional)" value={newLesson.video_url} onChange={e => setNewLesson({ ...newLesson, video_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                        <input placeholder="Handout URL (optional - link to PDF/doc)" value={newLesson.handout_url} onChange={e => setNewLesson({ ...newLesson, handout_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                        <input placeholder="Handout display name (e.g., 'Prompt Templates Cheat Sheet')" value={newLesson.handout_name} onChange={e => setNewLesson({ ...newLesson, handout_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-3" />
                        <div className="flex gap-2">
                          <button onClick={saveNewLesson} disabled={saving} className="bg-accent text-white text-xs px-4 py-2 rounded-lg">{saving ? "Saving..." : "Save Lesson"}</button>
                          <button onClick={() => setShowNewLesson(false)} className="text-gray-500 text-xs px-3 py-2">Cancel</button>
                        </div>
                      </div>
                    )}

                    {moduleLessons.map(lesson => (
                      <div key={lesson.id} className="border rounded-xl mb-3 overflow-hidden">
                        {editingLesson?.id === lesson.id ? (
                          <div className="p-4">
                            <input value={editingLesson.title} onChange={e => setEditingLesson({ ...editingLesson, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm font-semibold mb-2" />
                            <textarea value={editingLesson.content} onChange={e => setEditingLesson({ ...editingLesson, content: e.target.value })} rows={10} className="w-full px-3 py-2 border rounded-lg text-sm mb-2 font-mono" />
                            <input placeholder="Video URL (optional)" value={editingLesson.video_url || ""} onChange={e => setEditingLesson({ ...editingLesson, video_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                            <input placeholder="Handout URL (link to PDF/doc)" value={editingLesson.handout_url || ""} onChange={e => setEditingLesson({ ...editingLesson, handout_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                            <input placeholder="Handout display name" value={editingLesson.handout_name || ""} onChange={e => setEditingLesson({ ...editingLesson, handout_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-3" />
                            <div className="flex gap-2">
                              <button onClick={() => updateLesson(editingLesson)} disabled={saving} className="bg-accent text-white text-xs px-4 py-2 rounded-lg">{saving ? "Saving..." : "Save"}</button>
                              <button onClick={() => setEditingLesson(null)} className="text-gray-500 text-xs px-3 py-2">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold text-navy">{lesson.title}</div>
                              <div className="text-xs text-gray-400 mt-1">{lesson.content.substring(0, 120)}...</div>
                              {lesson.video_url && <div className="text-xs text-accent mt-1">&#127909; Video linked</div>}
                              {lesson.handout_url && <div className="text-xs text-terra mt-1">&#128206; Handout: {lesson.handout_name || "Download"}</div>}
                            </div>
                            <div className="flex gap-1 flex-shrink-0 ml-4">
                              <button onClick={() => aiImproveLesson(lesson)} disabled={aiGenerating !== null} className="text-purple-500 text-xs px-2 py-1 rounded hover:bg-purple-50 disabled:opacity-50" title="AI Improve">&#9733;</button>
                              <button onClick={() => aiVideoScript(lesson, selectedModule.title)} disabled={aiGenerating !== null} className="text-purple-500 text-xs px-2 py-1 rounded hover:bg-purple-50 disabled:opacity-50" title="Video Script">&#127909;</button>
                              <button onClick={() => setEditingLesson({ ...lesson })} className="text-accent text-xs px-2 py-1 rounded hover:bg-accent/10">Edit</button>
                              <button onClick={() => deleteLesson(lesson.id)} className="text-red-500 text-xs px-2 py-1 rounded hover:bg-red-50">Del</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quizzes */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-navy">Quiz Questions ({moduleQuizzes.length})</h3>
                      <div className="flex gap-2">
                        <button onClick={() => aiGenerateQuizzes(selectedModule.id, selectedModule.title)} disabled={aiGenerating !== null}
                          className="bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-100 disabled:opacity-50">
                          {aiGenerating === "quiz" ? "Generating..." : "AI Generate 5"}
                        </button>
                        <button onClick={() => setShowNewQuiz(true)} className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg">+ Add Quiz</button>
                      </div>
                    </div>

                    {showNewQuiz && (
                      <div className="bg-accent/5 rounded-xl p-4 mb-4">
                        <input placeholder="Question" value={newQuiz.question} onChange={e => setNewQuiz({ ...newQuiz, question: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                        {newQuiz.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2 mb-2">
                            <input
                              type="radio" name="correct" checked={newQuiz.correct_index === i}
                              onChange={() => setNewQuiz({ ...newQuiz, correct_index: i })}
                              className="accent-accent"
                            />
                            <input
                              placeholder={`Option ${i + 1}`} value={opt}
                              onChange={e => { const opts = [...newQuiz.options]; opts[i] = e.target.value; setNewQuiz({ ...newQuiz, options: opts }); }}
                              className="flex-1 px-3 py-2 border rounded-lg text-sm"
                            />
                          </div>
                        ))}
                        <div className="flex gap-2 mt-3">
                          <button onClick={saveNewQuiz} disabled={saving} className="bg-accent text-white text-xs px-4 py-2 rounded-lg">{saving ? "Saving..." : "Save Quiz"}</button>
                          <button onClick={() => setShowNewQuiz(false)} className="text-gray-500 text-xs px-3 py-2">Cancel</button>
                        </div>
                      </div>
                    )}

                    {moduleQuizzes.map(quiz => (
                      <div key={quiz.id} className="border rounded-xl mb-3 overflow-hidden">
                        {editingQuiz?.id === quiz.id ? (
                          <div className="p-4">
                            <input value={editingQuiz.question} onChange={e => setEditingQuiz({ ...editingQuiz, question: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm font-semibold mb-2" />
                            {editingQuiz.options.map((opt: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 mb-2">
                                <input type="radio" name="editCorrect" checked={editingQuiz.correct_index === i} onChange={() => setEditingQuiz({ ...editingQuiz, correct_index: i })} className="accent-accent" />
                                <input value={opt} onChange={e => { const opts = [...editingQuiz.options]; opts[i] = e.target.value; setEditingQuiz({ ...editingQuiz, options: opts }); }} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                              </div>
                            ))}
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => updateQuiz(editingQuiz)} disabled={saving} className="bg-accent text-white text-xs px-4 py-2 rounded-lg">{saving ? "Saving..." : "Save"}</button>
                              <button onClick={() => setEditingQuiz(null)} className="text-gray-500 text-xs px-3 py-2">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 flex items-center justify-between">
                            <div>
                              <div className="text-sm font-semibold text-navy">{quiz.question}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {quiz.options.map((opt: string, i: number) => (
                                  <span key={i} className={i === quiz.correct_index ? "text-green-600 font-semibold" : ""}>
                                    {i > 0 ? " | " : ""}{opt}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0 ml-4">
                              <button onClick={() => setEditingQuiz({ ...quiz })} className="text-accent text-xs px-2 py-1 rounded hover:bg-accent/10">Edit</button>
                              <button onClick={() => deleteQuiz(quiz.id)} className="text-red-500 text-xs px-2 py-1 rounded hover:bg-red-50">Del</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <div className="text-5xl mb-4">&#128218;</div>
                  <h3 className="text-xl font-display font-bold text-navy mb-2">Select a Module</h3>
                  <p className="text-gray-500">Click a module from the list to view and edit its content, or use the AI Assistant to generate new modules.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== AI ASSISTANT TAB ========== */}
        {activeTab === "ai" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="font-display font-bold text-navy mb-4">&#9889; Quick Generate</h3>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Module Topic</label>
                  <input
                    value={generateTopic}
                    onChange={e => setGenerateTopic(e.target.value)}
                    placeholder="e.g., AI for Open Houses"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Section</label>
                  <input
                    value={generateSection}
                    onChange={e => setGenerateSection(e.target.value)}
                    placeholder="e.g., Advanced AI Strategies"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Tier</label>
                  <select value={generateTier} onChange={e => setGenerateTier(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <button
                  onClick={aiGenerateModule}
                  disabled={aiGenerating !== null || !generateTopic.trim()}
                  className="w-full bg-purple-600 text-white font-semibold py-2.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {aiGenerating === "module" ? "Generating Module..." : "Generate Complete Module"}
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">Creates 3 lessons + 5 quiz questions</p>
              </div>

              {/* Create from Document */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h3 className="font-display font-bold text-navy mb-4">&#128196; Create from Document</h3>
                <p className="text-xs text-gray-400 mb-3">Upload a file or paste content and AI will create a complete training module from it.</p>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Upload File</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md,.csv,.rtf"
                    onChange={handleFileUpload}
                    disabled={docParsing}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 disabled:opacity-50"
                  />
                  {docParsing && <div className="text-xs text-purple-600 mt-1 animate-pulse">Parsing document... this may take a moment for large files.</div>}
                  {!docParsing && docFileName && <div className="text-xs text-accent mt-1">Loaded: {docFileName} ({docContent.length.toLocaleString()} chars)</div>}
                  <div className="text-[10px] text-gray-400 mt-1">Supports: PDF, DOCX, DOC, TXT, MD, CSV</div>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Or Paste Content</label>
                  <textarea
                    value={docContent}
                    onChange={e => setDocContent(e.target.value)}
                    placeholder="Paste document content here... (from Word, PDF, web page, etc.)"
                    rows={5}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                  />
                </div>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Module Name</label>
                  <input value={docModuleName} onChange={e => setDocModuleName(e.target.value)} placeholder="e.g., AI for Buyer Consultations" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Section</label>
                    <input value={docSection} onChange={e => setDocSection(e.target.value)} placeholder="Section name" className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Tier</label>
                    <select value={docTier} onChange={e => setDocTier(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Special Instructions (optional)</label>
                  <input value={docInstructions} onChange={e => setDocInstructions(e.target.value)} placeholder="e.g., Focus on first-time buyers" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>

                <button
                  onClick={aiGenerateFromDocument}
                  disabled={aiGenerating !== null || !docContent.trim()}
                  className="w-full bg-terra text-white font-semibold py-2.5 rounded-xl hover:bg-terra/90 transition-colors disabled:opacity-50"
                >
                  {aiGenerating === "document" ? "Creating Module from Document..." : "Create Module from Document"}
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-display font-bold text-navy mb-3">&#128161; Ideas to Try</h3>
                <div className="space-y-2">
                  {[
                    "AI for Open House Marketing",
                    "Chatbots for Lead Capture",
                    "AI-Powered Staging Recommendations",
                    "Using AI for Contract Review",
                    "AI Tools for Property Management",
                    "Voice AI and Virtual Assistants",
                  ].map(idea => (
                    <button
                      key={idea}
                      onClick={() => setGenerateTopic(idea)}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-accent/5 text-gray-600 hover:text-accent transition-colors"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
                <div className="p-4 border-b">
                  <h3 className="font-display font-bold text-navy">&#129302; AI Course Assistant</h3>
                  <p className="text-xs text-gray-400">Ask me anything about course content, get suggestions, or brainstorm new module ideas.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                      <div className="text-4xl mb-3">&#129302;</div>
                      <p className="text-sm">Hi! I&apos;m your AI course assistant. I can help you:</p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>&#8226; Plan new module topics</li>
                        <li>&#8226; Brainstorm lesson ideas</li>
                        <li>&#8226; Write video scripts</li>
                        <li>&#8226; Suggest improvements to existing content</li>
                      </ul>
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-accent text-white"
                          : "bg-gray-50 text-gray-700"
                      }`}>
                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                          __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
                      placeholder="Ask about course content, get ideas..."
                      className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-accent"
                    />
                    <button
                      onClick={sendChat}
                      disabled={aiLoading || !chatInput.trim()}
                      className="bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent/90 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== USERS TAB ========== */}
        {activeTab === "users" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-navy mb-1">{profiles.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-gold mb-1">{profiles.filter(p => p.tier === "premium").length}</div>
                <div className="text-sm text-gray-500">Premium Users</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-accent mb-1">{profiles.length - profiles.filter(p => p.tier === "premium").length}</div>
                <div className="text-sm text-gray-500">Free Users</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-terra mb-1">{profiles.filter(p => p.is_admin).length}</div>
                <div className="text-sm text-gray-500">Admins</div>
              </div>
            </div>

            {/* User table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-xl font-display font-bold text-navy">User Management</h2>
                  <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-accent w-full md:w-72" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
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
                          <div className="font-semibold text-navy text-sm">{profile.full_name || "\u2014"}</div>
                          <div className="text-xs text-gray-400">{profile.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${profile.is_admin ? "bg-terra/10 text-terra" : "bg-gray-100 text-gray-500"}`}>
                            {profile.is_admin ? "ADMIN" : "USER"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${profile.tier === "premium" ? "bg-gold/10 text-gold" : "bg-gray-100 text-gray-500"}`}>
                            {profile.tier?.toUpperCase() || "FREE"}
                          </span>
                        </td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-700">{getUserCompletions(profile.id)} / {modules.length}</span></td>
                        <td className="px-6 py-4"><span className="text-sm text-gray-500">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "\u2014"}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleTier(profile.id, profile.tier)}
                              disabled={updatingUser === profile.id}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                profile.tier === "premium" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                              } ${updatingUser === profile.id ? "opacity-50 cursor-wait" : ""}`}
                            >
                              {updatingUser === profile.id ? "..." : profile.tier === "premium" ? "Downgrade" : "Upgrade"}
                            </button>
                            <button
                              onClick={() => toggleAdmin(profile.id, profile.is_admin)}
                              disabled={updatingUser === profile.id}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                                profile.is_admin ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                              } ${updatingUser === profile.id ? "opacity-50 cursor-wait" : ""}`}
                            >
                              {updatingUser === profile.id ? "..." : profile.is_admin ? "Remove Admin" : "Make Admin"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProfiles.length === 0 && (
                <div className="p-12 text-center text-gray-400">{searchQuery ? "No users match your search." : "No users found."}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
