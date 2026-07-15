/** Original abstract illustration — geometric checklist/growth motif in the brand palette. No external assets. */
export function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-md">
      <circle cx="240" cy="200" r="180" className="fill-accent" opacity="0.5" />
      <rect x="120" y="90" width="200" height="240" rx="16" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="150" y="130" width="140" height="10" rx="5" className="fill-muted-foreground/30" />
      <rect x="150" y="152" width="100" height="10" rx="5" className="fill-muted-foreground/20" />

      {[196, 234, 272].map((y, i) => (
        <g key={y}>
          <rect x="150" y={y} width="20" height="20" rx="5" className={i === 2 ? "fill-muted" : "fill-primary"} />
          {i !== 2 && (
            <path
              d={`M154 ${y + 10} L159 ${y + 15} L167 ${y + 5}`}
              stroke="var(--primary-foreground)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
          <rect x="182" y={y + 5} width="108" height="9" rx="4.5" className="fill-muted-foreground/25" />
        </g>
      ))}

      <circle cx="340" cy="110" r="34" className="fill-primary" />
      <path
        d="M328 110 L337 119 L354 100"
        stroke="var(--primary-foreground)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <rect x="90" y="290" width="70" height="70" rx="14" className="fill-card stroke-border" strokeWidth="1.5" />
      <path d="M110 335 L122 315 L134 328 L150 300" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="150" cy="300" r="4" className="fill-primary" />
    </svg>
  );
}
