import Link from "next/link";

import { TypshLogo } from "@/components/typsh-logo";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/30 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <TypshLogo size={24} />
            <div className="absolute inset-0 bg-foreground/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground font-sans">
            Typsh
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {"로그인"}
          </Link>
          <Button
            size="sm"
            asChild
            className="h-9 px-5 text-sm font-bold bg-foreground text-background hover:bg-foreground/90 rounded-full"
          >
            <Link href="/login">{"시작하기"}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-muted-foreground/80 transition-all hover:text-foreground relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all group-hover:w-full" />
    </a>
  );
}
