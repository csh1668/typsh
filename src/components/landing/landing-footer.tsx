import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TypshLogo } from "@/components/typsh-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        {/* CTA block */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl font-sans text-balance">
            {"지금 시작하세요"}
          </h2>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            {"계정을 만들고 첫 번째 Typst 문서를 작성해보세요."}
            <br />
            {"설치 없이 브라우저에서 바로 사용할 수 있습니다."}
          </p>
          <Button size="lg" asChild className="h-11 px-8 text-sm font-medium">
            <Link href="/login">{"무료로 시작하기"}</Link>
          </Button>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <div className="flex items-center gap-2.5">
            <TypshLogo size={18} />
            <span className="text-sm font-medium text-foreground">Typsh</span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            {"Built with Next.js, Typst WASM, and Liveblocks."}
          </p>
          <a
            href="https://github.com/csh1668/typsh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {"GitHub"}
          </a>
        </div>
      </div>
    </footer>
  );
}
