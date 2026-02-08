import { TypshLogo } from "@/components/typsh-logo";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-24 md:py-32 overflow-hidden">
      {/* Footer background glow */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-[300px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[100px]" />

      <div className="mx-auto max-w-5xl">
        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-12 md:flex-row">
          <div className="flex items-center gap-2.5">
            <TypshLogo size={20} />
            <span className="text-base font-bold text-foreground">Typsh</span>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/40">
            {"© 2026 Built with Next.js, Typst WASM, and Liveblocks."}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/csh1668/typsh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {"GitHub"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
