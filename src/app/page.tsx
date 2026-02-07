import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BackgroundGlow } from "@/components/background-glow";
import { HeroSection } from "@/components/landing/hero-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/projects");

  return (
    <div className="min-h-screen">
      <BackgroundGlow />

      <div className="relative z-10">
        <Header />

        <HeroSection />
        {/* <EditorPreview />
        <FeaturesSection />
        <TechSection /> */}

        <Footer />
      </div>
    </div>
  );
}
