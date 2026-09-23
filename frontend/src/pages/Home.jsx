import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ArrowUpRight, ArrowRight, ShieldCheck, Factory, Package, Boxes, ScanSearch,
  Headphones, Leaf, Star, MapPin, CheckCircle2, FlaskConical, Microscope,
  Warehouse, Truck, ChevronDown,
} from 'lucide-react';
import Marquee from '../components/Marquee';
import LicenseSlider from '../components/LicenseSlider';
import Magnetic from '../components/Magnetic';
import BatchEstimator from '../components/BatchEstimator';
import { Reveal, MaskedLine, FadeIn, SectionHead } from '../components/Reveal';
import { useLang } from '../i18n/LanguageContext';
import {
  images, chapters, stats, capacity, countries, processSteps,
  principles, testimonials, marqueeItems, dosageShowcase, certifications,
} from '../data/content';

const PRINCIPLE_ICONS = { Factory, Package, Boxes, ScanSearch, Headphones, Leaf };

const Counter = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const target = parseInt(value, 10) || 0;
    const controls = animate(0, target, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>{display}{value.replace(/^[0-9]+/, '')}</span>;
};

const Hero = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 16 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 16 });
  const pillX = useSpring(useTransform(mx, [-0.5, 0.5], [-24, 24]), { stiffness: 90, damping: 18 });
  const pillY = useSpring(useTransform(my, [-0.5, 0.5], [-16, 16]), { stiffness: 90, damping: 18 });
  const onHeroMouse = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section ref={ref} onMouseMove={onHeroMouse} className="dark-mesh relative flex min-h-screen flex-col overflow-hidden pt-28" data-testid="hero-section">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <motion.div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-pink-600/25 blur-3xl" animate={{ x: [0, 50, 0], y: [0, -35, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="pointer-events-none absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full bg-sky-500/25 blur-3xl" animate={{ x: [0, -45, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" animate={{ x: [0, 30, 0], y: [0, -25, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-5 pb-14 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <FadeIn delay={0.15}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300" data-testid="hero-overline">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {t('heroOverline')}
            </span>
          </FadeIn>

          <h1 className="font-display mt-8 font-extrabold leading-[0.95] tracking-tight" data-testid="hero-title">
            <MaskedLine delay={0.25} className="text-[14vw] text-white sm:text-7xl lg:text-[6.2rem]">
              {t('heroTitleA')}
            </MaskedLine>
            <MaskedLine delay={0.4} className="outline-text-light text-[14vw] sm:text-7xl lg:text-[6.2rem]">
              {t('heroTitleB')}
            </MaskedLine>
            <MaskedLine delay={0.55} className="text-infinity-gradient text-[14vw] sm:text-7xl lg:text-[6.2rem]">
              {t('heroTitleC')}
            </MaskedLine>
          </h1>

          <FadeIn delay={0.85}>
            <p className="mt-7 max-w-lg text-base leading-relaxed text-slate-400" data-testid="hero-subtitle">
              {t('heroSub')}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic>
                <button
                  data-testid="hero-quote-button"
                  onClick={() => navigate('/contact')}
                  className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-xl shadow-black/30 transition-all duration-300 hover:bg-pink-500 hover:text-white active:scale-95"
                >
                  {t('ctaQuote')}
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  data-testid="hero-products-button"
                  onClick={() => navigate('/products')}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:border-white/50 hover:bg-white/10 active:scale-95"
                >
                  {t('ctaProducts')}
                  <ArrowRight size={16} />
                </button>
              </Magnetic>
            </div>
          </FadeIn>

          <FadeIn delay={1.05}>
            <div className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-white/10" data-testid="hero-stats">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label} className="px-5 first:pl-0">
                  <div className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={1.1} className="mt-10 lg:hidden">
            <img
              src="/assets/categories/gummy-candy.webp"
              alt="Infinitives Healthcare finished formulation"
              className="h-60 w-full rounded-[2rem] border border-white/15 object-cover"
            />
          </FadeIn>
        </div>

        <motion.div style={{ y: imgY }} className="relative hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1100 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-tr from-pink-600/30 via-sky-500/25 to-amber-400/25 blur-3xl" />
            <div className="animate-spin-slow absolute -inset-8 -z-10 rounded-full border-2 border-dashed border-white/15" />
            <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ x: pillX, y: pillY }}>
              <span className="animate-float absolute -left-10 top-12 h-5 w-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 shadow-lg shadow-pink-500/50" />
              <span className="animate-float-slow absolute -right-8 top-1/3 h-5 w-14 rotate-45 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/50" />
              <span className="animate-float absolute -bottom-2 left-8 h-5 w-12 -rotate-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-lg shadow-amber-500/50" style={{ animationDelay: '1.2s' }} />
            </motion.div>
            <img
              src="/assets/categories/gummy-candy.webp"
              alt="Infinitives Healthcare finished formulation"
              data-testid="hero-product-image"
              className="h-[30rem] w-full rounded-[3rem] border border-white/15 object-cover shadow-2xl shadow-black/50"
            />
            <FadeIn delay={1.15} className="absolute -left-12 top-10 z-30">
              <div className="glass-dark animate-float w-56 rounded-3xl p-5" data-testid="hero-card-formulation">
                <div className="flex items-center gap-3">
                  <img src={images.gummies} alt="Gummies" className="h-11 w-11 rounded-2xl object-cover" />
                  <div>
                    <p className="text-sm font-bold text-white">{t('heroCard1Title')}</p>
                    <p className="text-xs text-slate-400">{t('heroCard1Sub')}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={1.3} className="absolute -right-6 bottom-12 z-30">
              <div className="glass-dark animate-float-slow w-52 rounded-3xl p-5" data-testid="hero-card-quality">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-400">
                    <ShieldCheck size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{t('heroCard2Title')}</p>
                    <p className="text-xs text-slate-400">{t('heroCard2Sub')}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-24 left-1/2 z-20 hidden -translate-x-1/2 lg:block" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
        <ChevronDown size={22} className="text-white/40" />
      </motion.div>

      <div className="relative z-10 mt-auto border-t border-white/10">
        <Marquee items={marqueeItems} dark />
      </div>
    </section>
  );
};

const Chapters = () => {
  const { t } = useLang();
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="chapters-section">
      <SectionHead overline={t('chaptersOverline')} title={t('chaptersTitle')} sub={t('chaptersSub')} />
      <div className="space-y-24">
        {chapters.map((c, i) => (
          <div key={c.number} className={`grid items-center gap-12 lg:grid-cols-2 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <Reveal>
              <div className="relative">
                <span className="font-display block text-[7rem] font-extrabold leading-none text-slate-100 sm:text-[9rem]" aria-hidden>
                  {c.number}
                </span>
                <div className="-mt-16 sm:-mt-20">
                  <span
                    className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
                    style={{ backgroundColor: c.accent }}
                  >
                    {c.capacity}
                  </span>
                  <h3 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{c.title}</h3>
                  <p className="mt-4 max-w-lg leading-relaxed text-slate-600">{c.description}</p>
                  <ul className="mt-6 space-y-2.5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                        <CheckCircle2 size={16} style={{ color: c.accent }} /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="group relative overflow-hidden rounded-[2.5rem]" data-testid={`chapter-image-${c.number}`}>
                <img src={c.image} alt={c.title} loading="lazy" className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <span className="glass-card absolute bottom-5 left-5 rounded-full px-4 py-2 text-xs font-bold text-slate-800">
                  {c.title}
                </span>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
};

const Capacity = () => {
  const { t } = useLang();
  return (
    <section className="dark-mesh relative overflow-hidden py-24 sm:py-32" data-testid="capacity-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead dark overline={t('capOverline')} title={t('capTitle')} sub={t('capSub')} />
        <div className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="glass-dark rounded-3xl p-6 text-center" data-testid={`stat-${i}`}>
                <div className="font-display text-4xl font-extrabold text-infinity-gradient sm:text-5xl"><Counter value={s.value} /></div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capacity.map((c, i) => (
            <Reveal key={c.unit} delay={i * 0.04}>
              <div className="group flex items-center justify-between rounded-2xl border border-white/10 px-6 py-5 transition-all duration-300 hover:border-pink-500/40 hover:bg-white/5" data-testid={`capacity-${i}`}>
                <span className="text-sm font-semibold text-slate-300">{c.unit}</span>
                <span className="font-display text-xl font-extrabold text-white transition group-hover:text-amber-400">{c.qty}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductShowcase = () => {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="product-showcase-section">
      <SectionHead overline={t('prodOverline')} title={t('prodTitle')} sub={t('prodSub')} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dosageShowcase.map((d, i) => (
          <Reveal key={d.id} delay={i * 0.06}>
            <Link
              to={`/products/${d.id}`}
              data-testid={`dosage-card-${d.id}`}
              className="group relative block overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white" style={{ backgroundColor: d.accent }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">{d.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{d.tagline}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-all duration-300 group-hover:border-transparent group-hover:text-white" style={{ backgroundColor: 'transparent' }}>
                  <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 text-center">
        <Link to="/products" data-testid="showcase-view-all-link" className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-sky-600">
          {t('ctaProducts')} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
};

const LicenseSection = () => (
  <section className="py-20 sm:py-24" data-testid="licenses-section">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <SectionHead
        overline="Licensed & certified"
        title="Audited for the world's strictest markets"
        sub="Eleven certifications and licenses stand behind every batch that leaves our plant."
      />
    </div>
    <LicenseSlider />
  </section>
);

const PROCESS_ICONS = [FlaskConical, Factory, Microscope, Package, ShieldCheck, Boxes, Warehouse, Truck];

const Process = () => {
  const { t } = useLang();
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 70%', 'end 55%'] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32" data-testid="process-section">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead overline={t('procOverline')} title={t('procTitle')} sub={t('procSub')} />
        <div ref={lineRef} className="relative">
          <div className="absolute left-7 top-0 h-full w-0.5 rounded-full bg-slate-100 lg:left-1/2 lg:-translate-x-1/2" />
          <motion.div
            className="absolute left-7 top-0 h-full w-0.5 origin-top rounded-full bg-gradient-to-b from-pink-500 via-sky-500 to-amber-400 lg:left-1/2 lg:-translate-x-1/2"
            style={{ scaleY: lineScale }}
          />
          <div className="space-y-8 lg:space-y-2">
            {processSteps.map((p, i) => {
              const Icon = PROCESS_ICONS[i] || Factory;
              const left = i % 2 === 0;
              return (
                <div key={p.step} className="relative lg:grid lg:grid-cols-2 lg:items-center lg:gap-24 lg:py-6">
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                    className="absolute left-7 top-8 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg ring-1 ring-slate-100 lg:left-1/2"
                  >
                    <Icon size={22} />
                  </motion.span>
                  <Reveal
                    delay={0.08}
                    className={`pl-20 lg:pl-0 ${left ? 'lg:col-start-1 lg:row-start-1 lg:pr-4 lg:text-right' : 'lg:col-start-2 lg:pl-4'}`}
                  >
                    <div className="group relative inline-block w-full rounded-3xl border border-slate-100 bg-[#f8fafc] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-500/10 sm:p-7" data-testid={`process-step-${p.step}`}>
                      <span className="font-display pointer-events-none absolute -top-5 right-5 text-5xl font-extrabold text-slate-200/80 transition group-hover:text-pink-200">{p.step}</span>
                      <h3 className="font-display text-lg font-bold text-slate-900">{p.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.description}</p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyCard = ({ p, i, alignRight = false }) => {
  const Icon = PRINCIPLE_ICONS[p.icon] || Factory;
  return (
    <Reveal delay={i * 0.07}>
      <div className={`group relative h-full overflow-hidden rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${alignRight ? 'lg:text-right' : ''}`} data-testid={`principle-${p.number}`}>
        <span className={`font-display absolute top-4 text-sm font-extrabold text-slate-200 transition group-hover:text-pink-400 ${alignRight ? 'left-5' : 'right-5'}`}>{p.number}</span>
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600/10 via-sky-500/10 to-amber-500/10 text-slate-800 transition group-hover:scale-110 ${alignRight ? 'lg:ml-auto' : ''}`}>
          <Icon size={22} />
        </span>
        <h3 className="font-display mt-4 text-lg font-bold text-slate-900">{p.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.description}</p>
      </div>
    </Reveal>
  );
};

const WhyUs = () => {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="why-us-section">
      <SectionHead overline={t('whyOverline')} title={t('whyTitle')} sub={t('whySub')} />
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
        <div className="order-2 space-y-5 lg:order-1">
          {principles.slice(0, 3).map((p, i) => <WhyCard key={p.number} p={p} i={i} alignRight />)}
        </div>
        <Reveal className="order-1 flex justify-center lg:order-2">
          <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80" data-testid="why-us-medallion">
            <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-slate-300" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-pink-500/10 via-sky-500/10 to-amber-400/10" />
            <div className="glass-card flex h-44 w-44 items-center justify-center rounded-full p-6 sm:h-56 sm:w-56 sm:p-8">
              <img src="/assets/logo-small.webp" alt="Infinitives Healthcare" className="w-full p-2" />
            </div>
          </div>
        </Reveal>
        <div className="order-3 space-y-5">
          {principles.slice(3).map((p, i) => <WhyCard key={p.number} p={p} i={i + 3} />)}
        </div>
      </div>
    </section>
  );
};

const GlobalPresence = () => {
  const { t } = useLang();
  return (
    <section className="dark-mesh relative overflow-hidden py-24 sm:py-32" data-testid="global-presence-section">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <SectionHead dark overline={t('globeOverline')} title={t('globeTitle')} sub={t('globeSub')} />
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {countries.map((c, i) => (
            <Reveal key={c} delay={i * 0.03} y={16}>
              <span className="glass-dark flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300" data-testid={`country-${c.toLowerCase()}`}>
                <MapPin size={13} className="text-pink-400" /> {c}
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-14">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2">
            {certifications.slice(0, 6).map((c) => (
              <span key={c} className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold tracking-[0.14em] text-slate-300">{c}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="testimonials-section">
      <SectionHead overline={t('testiOverline')} title={t('testiTitle')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((tst, i) => (
          <Reveal key={tst.name} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100" data-testid={`testimonial-${i}`}>
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: tst.rating }).map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">“{tst.text}”</p>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="text-sm font-bold text-slate-900">{tst.name}</p>
                <p className="text-xs text-slate-400">{tst.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const CTABand = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  return (
    <section className="px-5 pb-24 sm:px-8" data-testid="cta-section">
      <Reveal>
        <div className="hero-mesh relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] border border-slate-200/70 px-8 py-20 text-center shadow-xl shadow-slate-900/5">
          <h2 className="font-display mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-slate-600">{t('ctaSub')}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              data-testid="cta-quote-button"
              onClick={() => navigate('/contact')}
              className="group flex items-center gap-2 rounded-full bg-pink-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-pink-600/25 transition hover:bg-slate-900 active:scale-95"
            >
              {t('ctaQuote')} <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

const Home = () => (
  <main data-testid="home-page">
    <Hero />
    <Chapters />
    <Capacity />
    <LicenseSection />
    <ProductShowcase />
    <BatchEstimator />
    <Process />
    <WhyUs />
    <GlobalPresence />
    <Testimonials />
    <CTABand />
  </main>
);

export default Home;
