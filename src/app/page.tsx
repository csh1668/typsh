import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LandingHeader } from "@/components/landing/landing-header";
import { HeroSection } from "@/components/landing/hero-section";
import { EditorPreview } from "@/components/landing/editor-preview";
import { FeaturesSection } from "@/components/landing/features-section";
import { TechSection } from "@/components/landing/tech-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/projects");

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      {/* Top-center glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-foreground/[0.02] blur-[120px]" />

      <div className="relative z-10">
        <LandingHeader />
        <HeroSection />
        <EditorPreview />
        <FeaturesSection />
        <TechSection />
        <LandingFooter />
      </div>
    </div>
  );
}
