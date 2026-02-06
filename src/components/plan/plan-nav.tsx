"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const sections = [
  { id: "tech-stack", label: "Tech Stack" },
  { id: "architecture", label: "Architecture" },
  { id: "database", label: "Database" },
  { id: "liveblocks", label: "Liveblocks" },
  { id: "project-structure", label: "Structure" },
  { id: "phases", label: "Phases" },
  { id: "risks", label: "Risks" },
  { id: "services", label: "Services" },
] as const;

export function PlanNav() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-6 hidden lg:block" aria-label="On this page">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="flex flex-col gap-1 border-l border-border">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cn(
                "block border-l-2 py-1 pl-3 text-sm transition-colors",
                activeId === section.id
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
