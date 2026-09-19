import { licenses } from '../data/content';

const LicenseSlider = ({ dark = false }) => {
  const row = [...licenses, ...licenses];
  const fade = dark ? 'from-[#090d16]' : 'from-[#f8fafc]';
  return (
    <div className="relative overflow-hidden" data-testid="license-slider">
      <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r sm:w-32 ${fade} to-transparent`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l sm:w-32 ${fade} to-transparent`} />
      <div className="animate-marquee-fast flex w-max items-center gap-5 py-2">
        {row.map((src, i) => (
          <div
            key={i}
            data-testid={`license-badge-${i}`}
            className="flex h-28 w-44 shrink-0 items-center justify-center rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-100 transition-transform duration-300 hover:scale-105"
          >
            <img src={src} alt="Infinitives Healthcare certification badge" loading="lazy" className="max-h-full max-w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicenseSlider;
