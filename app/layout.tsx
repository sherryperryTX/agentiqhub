import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentIQ Hub — AI Mastery for Real Estate",
  description: "The premier AI certification course for real estate agents. Master AI tools, boost productivity, and earn your certification.",
  openGraph: {
    title: "AgentIQ Hub — AI Mastery for Real Estate",
    description: "The premier AI certification course for real estate agents.",
    url: "https://agentiqhub.com",
    siteName: "AgentIQ Hub",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">{children}</body>
    </html>
  );
}
