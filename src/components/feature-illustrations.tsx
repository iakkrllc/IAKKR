/** Original flat-style illustrations for the feature rows — abstract, not tied to any single brand. */

const TEAL = "#0f9488";
const TEAL_SOFT = "#ccfbf1";
const AMBER = "#d97706";
const AMBER_SOFT = "#fef3c7";

export function CentralizeIllustration() {
  return (
    <svg viewBox="0 0 480 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-md">
      <circle cx="240" cy="170" r="150" className="fill-accent" />
      <rect x="190" y="120" width="100" height="100" rx="20" className="fill-primary" />
      <path d="M215 170 L232 187 L268 148" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      <line x1="240" y1="120" x2="240" y2="55" stroke={TEAL} strokeWidth="3" strokeDasharray="6 6" />
      <circle cx="240" cy="45" r="30" fill={TEAL_SOFT} stroke={TEAL} strokeWidth="2.5" />
      <rect x="228" y="35" width="24" height="6" rx="3" fill={TEAL} />
      <rect x="228" y="47" width="16" height="6" rx="3" fill={TEAL} opacity="0.6" />

      <line x1="190" y1="150" x2="95" y2="110" stroke={AMBER} strokeWidth="3" strokeDasharray="6 6" />
      <circle cx="80" cy="100" r="30" fill={AMBER_SOFT} stroke={AMBER} strokeWidth="2.5" />
      <circle cx="80" cy="92" r="7" fill={AMBER} />
      <path d="M65 112 Q80 98 95 112" stroke={AMBER} strokeWidth="3" fill="none" strokeLinecap="round" />

      <line x1="290" y1="150" x2="390" y2="120" stroke="var(--primary)" strokeWidth="3" strokeDasharray="6 6" />
      <circle cx="400" cy="112" r="30" className="fill-accent" stroke="var(--primary)" strokeWidth="2.5" />
      <rect x="386" y="102" width="28" height="8" rx="2" className="fill-primary" />
      <rect x="386" y="115" width="20" height="6" rx="2" className="fill-primary" opacity="0.5" />

      <line x1="230" y1="220" x2="200" y2="280" stroke={TEAL} strokeWidth="3" strokeDasharray="6 6" />
      <circle cx="185" cy="295" r="26" fill={TEAL_SOFT} stroke={TEAL} strokeWidth="2.5" />
      <path d="M172 295 L182 305 L200 285" stroke={TEAL} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function UnifyIllustration() {
  return (
    <svg viewBox="0 0 480 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-md">
      <rect x="30" y="70" width="230" height="180" rx="16" fill={TEAL_SOFT} stroke={TEAL} strokeWidth="2" />
      <rect x="55" y="95" width="90" height="10" rx="5" fill={TEAL} />
      <rect x="55" y="122" width="180" height="14" rx="4" fill="white" stroke={TEAL} strokeWidth="1.5" />
      <rect x="65" y="128" width="60" height="4" rx="2" fill={TEAL} opacity="0.7" />
      <rect x="55" y="148" width="180" height="14" rx="4" fill="white" stroke={TEAL} strokeWidth="1.5" />
      <rect x="65" y="154" width="90" height="4" rx="2" fill={TEAL} opacity="0.7" />
      <rect x="55" y="188" width="70" height="34" rx="6" fill="white" stroke={TEAL} strokeWidth="1.5" />
      <rect x="135" y="188" width="70" height="34" rx="6" fill="white" stroke={TEAL} strokeWidth="1.5" />
      <rect x="65" y="198" width="50" height="6" rx="3" fill={TEAL} opacity="0.6" />
      <rect x="145" y="198" width="50" height="6" rx="3" fill={TEAL} opacity="0.6" />

      <path d="M270 160 L310 160" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--primary)" />
        </marker>
      </defs>

      <rect x="320" y="60" width="140" height="200" rx="16" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="340" y="82" width="60" height="26" rx="13" className="fill-accent" />
      <rect x="349" y="90" width="42" height="10" rx="5" className="fill-primary" opacity="0.8" />
      <rect x="340" y="120" width="100" height="24" rx="12" fill="white" stroke="var(--border)" strokeWidth="1.5" />
      <rect x="350" y="128" width="70" height="8" rx="4" fill="#9ca3af" />
      <rect x="340" y="156" width="100" height="24" rx="12" className="fill-primary" opacity="0.9" />
      <rect x="350" y="164" width="60" height="8" rx="4" fill="white" />
      <circle cx="440" cy="220" r="16" fill={AMBER} />
      <path d="M433 220 L438 226 L448 212" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SimplifyIllustration() {
  const cols = [
    { x: 40, label: "OPEN", items: 2 },
    { x: 190, label: "IN PROGRESS", items: 2 },
    { x: 340, label: "DONE", items: 1 },
  ];
  return (
    <svg viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-md">
      {cols.map((col, ci) => (
        <g key={col.label}>
          <rect x={col.x} y="30" width="120" height="270" rx="14" className="fill-muted" />
          <rect x={col.x + 16} y="48" width="88" height="10" rx="5" fill={ci === 2 ? TEAL : ci === 1 ? AMBER : "var(--primary)"} />
          {Array.from({ length: col.items }).map((_, i) => (
            <g key={i} transform={`translate(${col.x + 14}, ${76 + i * 66})`}>
              <rect width="92" height="52" rx="10" fill="white" stroke="var(--border)" strokeWidth="1.5" />
              <rect x="10" y="12" width="60" height="8" rx="4" fill="#9ca3af" />
              <rect x="10" y="28" width="40" height="6" rx="3" fill="#d1d5db" />
              <circle cx="78" cy="16" r="6" fill={ci === 2 ? TEAL : ci === 1 ? AMBER : "var(--primary)"} opacity="0.8" />
            </g>
          ))}
        </g>
      ))}
      <path d="M165 90 L185 90" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" markerEnd="url(#arrow2)" />
      <path d="M315 90 L335 90" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" markerEnd="url(#arrow2)" />
      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--foreground)" opacity="0.4" />
        </marker>
      </defs>
    </svg>
  );
}

export function AccessIllustration() {
  return (
    <svg viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full max-w-md">
      <rect x="60" y="60" width="220" height="150" rx="14" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="80" y="80" width="120" height="10" rx="5" fill="var(--primary)" opacity="0.8" />
      <rect x="80" y="102" width="180" height="8" rx="4" fill="#d1d5db" />
      <rect x="80" y="118" width="150" height="8" rx="4" fill="#e5e7eb" />
      <rect x="80" y="144" width="80" height="40" rx="8" fill={TEAL_SOFT} stroke={TEAL} strokeWidth="1.5" />
      <rect x="170" y="144" width="80" height="40" rx="8" fill={AMBER_SOFT} stroke={AMBER} strokeWidth="1.5" />

      <rect x="300" y="130" width="120" height="150" rx="18" className="fill-card stroke-border" strokeWidth="1.5" />
      <rect x="316" y="150" width="88" height="94" rx="10" className="fill-accent" />
      <circle cx="360" cy="180" r="18" fill="var(--primary)" />
      <path d="M352 180 L358 186 L370 172" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="330" y="205" width="60" height="8" rx="4" className="fill-primary" opacity="0.5" />
      <circle cx="360" cy="262" r="7" fill="var(--border)" />

      <path
        d="M280 135 Q290 100 300 135"
        stroke={TEAL}
        strokeWidth="2.5"
        strokeDasharray="5 6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
