const Marquee = ({ items, dark = false, reverse = false, fast = false }) => {
  const row = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden py-5 ${dark ? 'bg-[#090d16]' : 'bg-transparent'}`}
      data-testid="editorial-marquee"
    >
      <div className={`flex w-max items-center gap-10 whitespace-nowrap ${fast ? 'animate-marquee-fast' : 'animate-marquee'} ${reverse ? 'marquee-reverse' : ''}`}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className={`font-display text-xl font-extrabold uppercase tracking-[0.18em] sm:text-2xl ${dark ? 'text-white/80' : 'text-slate-800'}`}>
              {item}
            </span>
            <svg width="26" height="16" viewBox="0 0 104 64" fill="none" className="opacity-70">
              <path d="M8 44 C8 24 24 14 34 24 C44 34 52 46 62 46 C74 46 82 34 74 24 C66 14 50 20 44 32" stroke="#f59e0b" strokeWidth="16" strokeLinecap="round" />
              <path d="M96 20 C96 40 80 50 70 40 C60 30 52 18 42 18 C30 18 22 30 30 40 C38 50 54 44 60 32" stroke="#0284c7" strokeWidth="16" strokeLinecap="round" />
              <circle cx="52" cy="32" r="14" fill="#e91e63" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
