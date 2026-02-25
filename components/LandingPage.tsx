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

  const courses = [
    {
      icon: "🏠",
      title: "Undivided Interest in Property Ownership",
      desc: "Understand shared ownership structures, tenancy in common, joint tenancy, and how to guide clients through co-ownership transactions.",
      tag: "Real Estate Law",
      color: "bg-accent",
    },
    {
      icon: "🏦",
      title: "Representing Buyers in Foreclosed Properties",
      desc: "Navigate the foreclosure buying process from bank-owned properties to auction strategies. Protect your buyers and close deals with confidence.",
      tag: "Foreclosures",
      color: "bg-terra",
    },
    {
      icon: "📊",
      title: "Property Comparative Analysis",
      desc: "Master the art and science of CMAs. Learn to pull comps, adjust values, and present market analyses that win listings and set the right price.",
      tag: "Market Analysis",
      color: "bg-navy",
    },
    {
      icon: "📉",
      title: "Representing a Client in a Short-Sale Situation",
      desc: "Guide sellers through the short-sale process from lender negotiations to closing. Understand BPOs, hardship letters, and approval timelines.",
      tag: "Short Sales",
      color: "bg-gold",
    },
    {
      icon: "🛠️",
      title: "Real Estate Tools Training",
      desc: "Hands-on training for the essential tools every agent needs — dotloop, Google Drive, transaction management platforms, and more.",
      tag: "Tools & Tech",
      color: "bg-sage",
    },
    {
      icon: "🤖",
      title: "AI Mastery for Real Estate",
      desc: "The complete AI certification course for agents. 17 modules covering prompt engineering, AI-powered marketing, CMA automation, and business systems.",
      tag: "AI & Technology",
      color: "bg-accent",
      featured: true,
    },
  ];

  const features = [
    { icon: "🎓", title: "Professional Courses", desc: "Expert-designed curriculum built specifically for real estate professionals at every level" },
    { icon: "📝", title: "Quizzes & Assessments", desc: "Test your knowledge with module quizzes and earn certifications upon completion" },
    { icon: "🏆", title: "Earn Certifications", desc: "Showcase your expertise with professional certificates you can share with clients and brokers" },
    { icon: "📱", title: "Learn at Your Pace", desc: "Access lessons anytime, anywhere, on any device — fit training around your schedule" },
    { icon: "👥", title: "Team Training", desc: "Internal courses for brokerages and teams to onboard agents and maintain standards" },
    { icon: "⚡", title: "Practical & Actionable", desc: "Every course includes templates, checklists, and tools you can use immediately in the field" },
  ];

  const faqs = [
    { q: "Who are these courses designed for?", a: "Our courses are built specifically for real estate agents, brokers, and teams. Whether you're a new agent or a 20-year veteran, you'll find practical training that applies directly to your business." },
    { q: "How do the courses work?", a: "Each course is broken into modules with lessons and quizzes. You work through the material at your own pace, complete assessments, and earn a professional certificate when you finish." },
    { q: "Are there free courses available?", a: "Yes! Some courses and course modules are available for free. Premium courses are available as one-time purchases with lifetime access — no subscriptions or recurring fees." },
    { q: "Can I use this for my team or brokerage?", a: "Absolutely. We offer internal training courses that can be assigned to your team. Contact us about team pricing and custom training modules for your brokerage." },
    { q: "Do I get a certificate?", a: "Yes. Each course includes a professional certificate upon completion that you can share on LinkedIn, add to your resume, or display in your office." },
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
            <a href="#courses" className="text-navy hover:text-terra transition-colors">Courses</a>
            <a href="#why" className="text-navy hover:text-terra transition-colors">Why AgentIQ</a>
            <a href="#faq" className="text-navy hover:text-terra transition-colors">FAQ</a>
            <Link href="/courses" className="bg-navy text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-navy-dark transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-terra/10 text-terra px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Professional Training for Real Estate Agents
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-navy mb-6 leading-tight">
            Level Up Your<br />Real Estate Career
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            From foreclosures and short sales to AI-powered marketing and property analysis —
            get the specialized training you need to serve your clients better and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/courses" className="bg-terra text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-terra-dark transition-all shadow-lg hover:shadow-xl">
              Browse All Courses
            </Link>
            <a href="#courses" className="border-2 border-navy text-navy px-8 py-4 rounded-xl text-lg font-semibold hover:bg-navy hover:text-white transition-all">
              See What We Offer
            </a>
          </div>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span><strong className="text-navy text-lg">{courses.length}</strong> Courses</span>
            <span><strong className="text-navy text-lg">Self-</strong>Paced</span>
            <span><strong className="text-navy text-lg">Pro</strong> Certificates</span>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section id="courses" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-navy text-center mb-4">Our Training Courses</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Specialized courses covering the skills, knowledge, and tools that today&apos;s real estate professionals need to succeed.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <div key={i} className={`bg-cream rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${course.featured ? "border-terra" : "border-transparent"} group`}>
                {course.featured && (
                  <div className="bg-terra text-white text-center text-xs font-bold py-1.5 tracking-wider">
                    FEATURED COURSE
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{course.icon}</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full text-white ${course.color}`}>
                      {course.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-terra transition-colors">{course.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{course.desc}</p>
                  <Link href="/courses" className="text-accent font-semibold text-sm hover:underline">
                    Learn More &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/courses" className="inline-block bg-navy text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-navy-dark transition-all shadow-lg">
              View All Courses &amp; Enroll
            </Link>
          </div>
        </div>
      </section>

      {/* Why AgentIQ */}
      <section id="why" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-navy text-center mb-12">Why Train with AgentIQ Hub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-navy text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-bold text-navy mb-2">Choose a Course</h3>
              <p className="text-gray-600 text-sm">Browse our catalog and pick the training that fits your goals — whether it&apos;s foreclosures, CMAs, AI, or tools.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-terra/10 rounded-full flex items-center justify-center text-terra text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-bold text-navy mb-2">Learn at Your Pace</h3>
              <p className="text-gray-600 text-sm">Work through lessons and quizzes on your own schedule. Each module builds on the last for a structured learning path.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-bold text-navy mb-2">Get Certified</h3>
              <p className="text-gray-600 text-sm">Complete the course, pass your assessments, and earn a professional certificate to share with clients and colleagues.</p>
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
            <p className="text-terra font-semibold mb-4">iClick Homes | Real Estate Training Expert</p>
            <p className="text-gray-600 leading-relaxed">
              With years of hands-on experience in real estate and a passion for agent education,
              Sherry Perry has designed every course to deliver practical, field-tested knowledge.
              From navigating complex transactions to leveraging the latest technology, her training
              programs help agents at every level perform at their best.
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
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Grow Your Real Estate Career?</h2>
          <p className="text-white/70 mb-8">Join agents across the country who are sharpening their skills and earning certifications with AgentIQ Hub.</p>
          <Link href="/courses" className="inline-block bg-terra text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-terra-dark transition-all shadow-lg">
            Browse Courses &amp; Get Started
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
