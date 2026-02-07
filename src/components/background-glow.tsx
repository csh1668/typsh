export function BackgroundGlow() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15]" />

      {/* Primary Glows */}
      <div className="absolute -top-[10%] left-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute top-[10%] -right-[10%] h-[700px] w-[700px] rounded-full bg-purple-500/15 blur-[140px]" />
      <div className="absolute bottom-[0%] left-[-5%] h-[600px] w-[600px] rounded-full bg-emerald-500/15 blur-[120px]" />

      {/* Subtle secondary accents */}
      <div className="absolute top-[40%] left-[20%] h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-[120px]" />

      {/* Top center spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[800px] w-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[80px]" />

      {/* Radial fade to make the edges darker and blend with background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)]" />
    </div>
  );
}
