export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 420"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Illustration d'un ordinateur portable, d'une batterie et d'un chargeur"
    >
      <defs>
        <linearGradient id="laptopBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="laptopScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="batteryGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* halo decoratif */}
      <circle cx="260" cy="210" r="190" fill="#ffffff" opacity="0.5" />
      <circle cx="260" cy="210" r="150" fill="#e0e7ff" opacity="0.6" />

      {/* base / ombre */}
      <ellipse cx="260" cy="360" rx="170" ry="18" fill="#c7d2fe" opacity="0.5" />

      {/* clavier */}
      <path d="M110 260 L410 260 L440 320 L80 320 Z" fill="#cbd5e1" />
      <rect x="130" y="272" width="260" height="34" rx="4" fill="#94a3b8" opacity="0.5" />

      {/* ecran */}
      <g>
        <rect x="140" y="60" width="240" height="200" rx="14" fill="url(#laptopBody)" stroke="#cbd5e1" />
        <rect x="156" y="76" width="208" height="150" rx="6" fill="url(#laptopScreen)" />
        {/* icone eclair sur l'ecran */}
        <path
          d="M268 110 L236 168 L256 168 L248 200 L292 142 L270 142 Z"
          fill="white"
          opacity="0.9"
        />
      </g>

      {/* batterie, au sol a gauche */}
      <g transform="translate(70 300)">
        <rect x="0" y="0" width="110" height="46" rx="8" fill="url(#batteryGrad)" />
        <rect x="14" y="10" width="82" height="26" rx="4" fill="#475569" />
        <rect x="24" y="16" width="16" height="14" rx="2" fill="#22c55e" />
        <rect x="44" y="16" width="16" height="14" rx="2" fill="#22c55e" />
        <rect x="64" y="16" width="16" height="14" rx="2" fill="#4ade80" opacity="0.6" />
      </g>

      {/* chargeur, au sol a droite */}
      <g transform="translate(340 296)">
        <rect x="0" y="0" width="70" height="50" rx="10" fill="#0f172a" />
        <circle cx="35" cy="25" r="9" fill="#6366f1" />
        <path
          d="M70 25 L110 25 L110 8 L118 8"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="120" cy="8" r="5" fill="#94a3b8" />
      </g>

      {/* petit badge "disponible" flottant */}
      <g transform="translate(370 90)">
        <rect x="0" y="0" width="86" height="30" rx="15" fill="white" stroke="#e2e8f0" />
        <circle cx="16" cy="15" r="4" fill="#22c55e" />
        <text x="28" y="19" fontSize="11" fontFamily="sans-serif" fill="#334155" fontWeight="600">
          Disponible
        </text>
      </g>
    </svg>
  );
}
