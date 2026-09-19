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
            <img src="/assets/logo-correct.jpeg" alt="Infinitives Healthcare" className="h-8 w-auto rounded-lg opacity-80" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
