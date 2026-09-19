const Logo = ({ dark = false, compact = false }) => (
  <div className="flex items-center gap-3" data-testid="brand-logo">
    <svg width="52" height="32" viewBox="0 0 104 64" fill="none" aria-label="Infinitives Healthcare logo">
      <path d="M8 44 C8 24 24 14 34 24 C44 34 52 46 62 46 C74 46 82 34 74 24 C66 14 50 20 44 32" stroke="#f59e0b" strokeWidth="16" strokeLinecap="round" opacity="0.95" />
      <path d="M96 20 C96 40 80 50 70 40 C60 30 52 18 42 18 C30 18 22 30 30 40 C38 50 54 44 60 32" stroke="#0284c7" strokeWidth="16" strokeLinecap="round" opacity="0.9" />
      <circle cx="52" cy="32" r="14" fill="#e91e63" opacity="0.92" />
    </svg>
    {!compact && (
      <div className="leading-none">
        <div className={`font-display font-extrabold tracking-tight text-lg sm:text-xl ${dark ? 'text-white' : 'text-slate-900'}`}>
          INFINITIVES
        </div>
        <div className={`text-[10px] font-bold tracking-[0.32em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          HEALTHCARE
        </div>
      </div>
    )}
  </div>
);

export default Logo;
