import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-6 pt-28 pb-20 md:pt-40 md:pb-28">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center rounded-full border border-border bg-card/60 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {"Open Source & Free"}
      </div>

      {/* Headline */}
      <h1 className="max-w-3xl text-center text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl text-balance font-sans">
        {"Typst 문서를"}
        <br className="hidden md:block" />
        {"브라우저에서 함께 작성하세요"}
      </h1>

      {/* Subheadline */}
      <p className="mt-5 max-w-xl text-center text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
        {"실시간 협업 에디터와 브라우저 내 WASM 컴파일로"}
        <br className="hidden md:block" />
        {"설치 없이 어디서든 Typst 문서를 작성하고 공유하세요."}
      </p>

      {/* CTA */}
      <div className="mt-10 flex items-center gap-4">
        <Button size="lg" asChild className="h-11 px-6 text-sm font-medium">
          <Link href="/login">{"무료로 시작하기"}</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className="h-11 px-6 text-sm font-medium"
        >
          <a
            href="https://github.com/csh1668/typsh"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
            {"GitHub"}
          </a>
        </Button>
      </div>

      {/* Command hint */}
      <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
        <span className="text-xs text-muted-foreground font-mono">
          {"Overleaf"}
        </span>
        <span className="text-xs text-muted-foreground/50">{"for"}</span>
        <span className="text-xs text-foreground font-mono font-semibold">
          {"Typst"}
        </span>
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
