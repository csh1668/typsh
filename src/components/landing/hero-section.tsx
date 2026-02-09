import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-28 pb-20 md:pt-40 md:pb-28">
      {/* Badge */}
      <div className="mb-8 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-colors hover:border-emerald-500/30">
        <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        {"Open Source & Free"}
      </div>

      {/* Headline */}
      <h1 className="max-w-4xl text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance font-sans">
        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          {"Typst 문서를 브라우저에서"}
          <br className="hidden md:block" />
          {"다같이 작성하세요"}
        </span>
      </h1>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <Button
          size="lg"
          asChild
          className="h-12 px-8 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]"
        >
          <Link href="/login">{"무료로 시작하기"}</Link>
        </Button>
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mr-1.5 h-4 w-4"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
