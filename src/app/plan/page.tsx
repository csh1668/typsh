import type { Metadata } from "next";

import { ArchitectureSection } from "@/components/plan/architecture-section";
import { DatabaseSection } from "@/components/plan/database-section";
import { LiveblocksSection } from "@/components/plan/liveblocks-section";
import { PhasesSection } from "@/components/plan/phases-section";
import { PlanHero } from "@/components/plan/plan-hero";
import { PlanNav } from "@/components/plan/plan-nav";
import { ProjectStructureSection } from "@/components/plan/project-structure-section";
import { RisksSection } from "@/components/plan/risks-section";
import { ServicesSection } from "@/components/plan/services-section";
import { TechStackSection } from "@/components/plan/tech-stack-section";

export const metadata: Metadata = {
  title: "Typsh - Project Plan",
  description:
    "Architecture, tech stack, and implementation roadmap for the Typsh collaborative Typst editor.",
};

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-background">
      <PlanHero />

      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-12">
        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col gap-16">
          <div id="tech-stack">
            <TechStackSection />
          </div>
          <div id="architecture">
            <ArchitectureSection />
          </div>
          <div id="database">
            <DatabaseSection />
          </div>
          <div id="liveblocks">
            <LiveblocksSection />
          </div>
          <div id="project-structure">
            <ProjectStructureSection />
          </div>
          <div id="phases">
            <PhasesSection />
          </div>
          <div id="risks">
            <RisksSection />
          </div>
          <div id="services">
            <ServicesSection />
          </div>
        </main>

        {/* Sidebar TOC */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <PlanNav />
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs text-muted-foreground">
            Typsh Project Plan
          </p>
        </div>
      </footer>
    </div>
  );
}
