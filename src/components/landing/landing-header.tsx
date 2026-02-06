import Link from "next/link";

import { TypshLogo } from "@/components/typsh-logo";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <TypshLogo size={22} />
          <span className="text-base font-semibold tracking-tight text-foreground font-sans">
            Typsh
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {"기능"}
          </a>
          <a
            href="#editor"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {"에디터"}
          </a>
          <a
            href="#tech"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {"기술 스택"}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" className="text-sm text-muted-foreground">
              {"로그인"}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login">{"시작하기"}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
