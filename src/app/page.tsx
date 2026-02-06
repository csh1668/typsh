import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BackgroundGlow } from "@/components/landing/background-glow";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/projects");

  return (
    <div className="min-h-screen">
      <BackgroundGlow />

      <div className="relative z-10">
        <LandingHeader />

        <HeroSection />
        {/* <EditorPreview />
        <FeaturesSection />
        <TechSection /> */}

        <LandingFooter />
      </div>
    </div>
  );
}
