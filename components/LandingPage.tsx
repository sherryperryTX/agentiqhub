"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const features = [
    { icon: "🎓", title: "17 Professional Modules", desc: "Comprehensive curriculum covering every AI tool a realtor needs" },
    { icon: "📝", title: "85+ Quiz Questions", desc: "Test your knowledge and reinforce learning at every step" },
    { icon: "🏆", title: "Professional Certificate", desc: "Earn your AI Mastery certification to showcase your expertise" },
    { icon: "⚡", title: "Ready-to-Use Templates", desc: "Copy-paste prompts for listings, emails, CMAs, and more" },
    { icon: "📱", title: "Learn at Your Pace", desc: "Access lessons anytime, anywhere, on any device" },
    { icon: "🔒", title: "Free Tier Available", desc: "Start with 8 modules free — upgrade when you're ready" },
  ];

  const faqs = [
    { q: "Do I need any technical experience?", a: "Not at all! This course is designed specifically for real estate agents, not tech professionals. We start from the very basics and guide you step by step." },
    { q: "How long does the course take to complete?", a: "The full course is 6+ hours of content across 17 modules. Most agents complete it in 2-3 weeks at their own pace, spending about 30 minutes per day." },
    { q: "Is the Free Tier really free?", a: "Yes! Modules 1-8 are completely free with no credit card required. You'll learn AI foundations, essential tools, and practical skills. Upgrade to Premium only if you want the advanced modules and certification." },
    { q: "What do I get with Premium?", a: "Premium ($197 one-time) unlocks Modules 9-17 covering advanced real estate AI workflows, transaction management, business systems, and the certification assessment. Plus a professional certificate you can share on LinkedIn." },
    { q: "Can I use what I learn immediately?", a: "Absolutely. Every module includes ready-to-use prompt templates you can copy and customize for your business right away. Most agents see time savings within their first week." },
  ];

  const curriculum = [
    { section: "Section I: AI Foundations", tier: "free", modules: ["What is AI? A Realtor's Guide", "Setting Up Your AI Toolkit", "Prompt Engineering for Realtors", "AI Ethics & Compliance"] },
    { section: "Section II: Essential AI Tools", tier: "free", modules: ["AI-Powered Email Mastery", "AI for Market Analysis", "AI-Powered Social Media", "AI Writing Workshop"] },
    { section: "Section III: Real Estate AI Workflows", tier: "premium", modules: ["AI Listing Description Mastery", "Client Communication Mastery", "CMA & Market Analysis Pro", "AI Marketing Systems"] },
    { section: "Section IV: Advanced AI Strategies", tier: "premium", modules: ["Transaction Management with AI", "Social Media Strategy Pro", "Presentations & Client Materials", "AI Business Systems"] },
    { section: "Section V: Certification", tier: "premium", modules: ["Certification Assessment"] },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-navy">AgentIQ</span>
            <span className="text-2xl font-display text-terra">Hub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#curriculum" className="text-navy hover:text-terra transition-colors">Curriculum</a>
            <a href="#pricing" className="text-navy hover:text-terra transition-colors">Pricing</a>
            <a href="#faq" className="text-navy hover:text-terra transition-colors">FAQ</a>
            <Link href="/courses" className="bg-navy text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-navy-dark transition-colors">
              Browse Courses
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-terra/10 text-terra px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🏅 Professional Training Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-navy mb-6 leading-tight">
            Agent Training<br />Powered by AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional training courses for real estate agents — AI mastery, tools training,
            REO certification, and more. Learn at your own pace, earn certifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/courses" className="bg-terra text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-terra-dark transition-all shadow-lg hover:shadow-xl">
              Browse Courses
            </Link>
            <a href="#curriculum" className="border-2 border-navy text-navy px-8 py-4 rounded-xl text-lg font-semibold hover:bg-navy hover:text-white transition-all">
              View AI Mastery Curriculum
            </a>
          </div>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span><strong className="text-navy text-lg">17</strong> Modules</span>
            <span><strong className="text-navy text-lg">6+</strong> Hours</span>
            <span><strong className="text-navy text-lg">85+</strong> Quiz Questions</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-navy text-center mb-12">Everything You Need to Master AI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-cream rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-navy text-center mb-4">Full Curriculum</h2>
          <p className="text-center text-gray-600 mb-12">17 modules designed specifically for real estate professionals</p>
          <div className="space-y-6">
            {curriculum.map((sec, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className={`px-6 py-4 flex items-center justify-between ${sec.tier === "premium" ? "bg-navy" : "bg-accent"}`}>
                  <h3 className="text-white font-bold">{sec.section}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sec.tier === "premium" ? "bg-gold text-white" : "bg-white/20 text-white"}`}>
                    {sec.tier === "premium" ? "PREMIUM" : "FREE"}
                  </span>
                </div>
                <div className="p-6">
                  {sec.modules.map((mod, j) => (
                    <div key={j} className="flex items-center gap-3 py-2">
                      <span className="text-accent">✓</span>
                      <span className="text-gray-700">{mod}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-navy text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-cream rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-navy mb-2">Free Tier</h3>
              <div className="text-4xl font-bold text-navy mb-4">$0</div>
              <p className="text-gray-600 mb-6">Perfect to get started</p>
              <ul className="space-y-3 mb-8">
                {["Modules 1-8 (AI Foundations + Essential Tools)", "Quiz assessments for each module", "Ready-to-use prompt templates", "Lifetime access to free content"].map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent">✓</span><span className="text-gray-700 text-sm">{item}</span></li>
                ))}
              </ul>
              <Link href="/courses" className="block text-center bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent-dark transition-colors">
                Start Free
              </Link>
            </div>
            {/* Premium */}
            <div className="bg-navy rounded-2xl p-8 text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Certification</h3>
              <div className="text-4xl font-bold mb-4">$197</div>
              <p className="text-white/70 mb-6">One-time payment, lifetime access</p>
              <ul className="space-y-3 mb-8">
                {["All 17 modules (everything in Free + 9 advanced)", "85+ quiz questions across all modules", "Professional AI Mastery Certificate", "Transaction & business AI systems", "Private community access"].map((item, i) => (
                  <li key={i} className="flex gap-2"><span className="text-gold">✓</span><span className="text-white/90 text-sm">{item}</span></li>
                ))}
              </ul>
              <Link href="/courses" className="block text-center bg-terra text-white py-3 rounded-xl font-semibold hover:bg-terra-dark transition-colors">
                Get Premium Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-navy mb-6">Your Instructor</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-24 h-24 bg-terra rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-display">SP</div>
            <h3 className="text-xl font-bold text-navy mb-2">Sherry Perry</h3>
            <p className="text-terra font-semibold mb-4">iClick Homes | AI in Real Estate Pioneer</p>
            <p className="text-gray-600 leading-relaxed">
              Sherry Perry has been at the forefront of integrating AI into real estate workflows.
              As a practicing agent and technology advocate, she brings hands-on experience with every
              tool and technique taught in this course. Her mission: help every agent in America
              work smarter with AI.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-navy text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-navy">{faq.q}</span>
                  <span className="text-gray-400 ml-4">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-navy text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Master AI for Real Estate?</h2>
          <p className="text-white/70 mb-8">Join hundreds of agents who are already saving hours every week with AI.</p>
          <Link href="/dashboard" className="inline-block bg-terra text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-terra-dark transition-all shadow-lg">
            Start Learning Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-navy-dark text-white/50 text-center text-sm">
        <p>&copy; 2026 AgentIQ Hub by iClick Homes. All rights reserved.</p>
      </footer>
    </div>
  );
}
