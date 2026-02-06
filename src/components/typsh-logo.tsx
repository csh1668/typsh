export function TypshLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="6" className="fill-foreground" />
      <text
        x="14"
        y="19.5"
        textAnchor="middle"
        className="fill-background"
        fontSize="14"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), monospace"
      >
        T
      </text>
    </svg>
  );
}
