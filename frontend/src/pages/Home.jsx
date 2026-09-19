import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight, ArrowRight, ShieldCheck, Factory, Package, Boxes, ScanSearch,
  Headphones, Leaf, Star, MapPin, Phone, CheckCircle2,
} from 'lucide-react';
import Marquee from '../components/Marquee';
import { Reveal, MaskedLine, FadeIn, SectionHead } from '../components/Reveal';
import { useLang } from '../i18n/LanguageContext';
import {
  images, chapters, stats, capacity, countries, processSteps,
  principles, testimonials, marqueeItems, dosageShowcase, executives, certifications,
} from '../data/content';

const PRINCIPLE_ICONS = { Factory, Package, Boxes, ScanSearch, Headphones, Leaf };

const Hero = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const typeY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={ref} className="hero-mesh relative flex min-h-screen flex-col overflow-hidden pt-28" data-testid="hero-section">
      <motion.div
        className="pointer-events-none absolute -right-32 top-16 h-[34rem] w-[34rem] opacity-[0.07]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 104 64" className="h-full w-full">
          <path d="M8 44 C8 24 24 14 34 24 C44 34 52 46 62 46 C74 46 82 34 74 24 C66 14 50 20 44 32" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M96 20 C96 40 80 50 70 40 C60 30 52 18 42 18 C30 18 22 30 30 40 C38 50 54 44 60 32" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8">
        <FadeIn delay={0.15}>
          <div className="flex justify-center">
            <span className="glass-card rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700" data-testid="hero-overline">
              {t('heroOverline')}
            </span>
          </div>
        </FadeIn>

        <motion.div style={{ y: typeY }} className="relative z-10 mt-8 text-center">
          <h1 className="font-display font-extrabold leading-[0.95] tracking-tight" data-testid="hero-title">
            <MaskedLine delay={0.25} className="text-[13vw] text-slate-900 sm:text-[11vw] lg:text-[8.5rem]">
              {t('heroTitleA')}
            </MaskedLine>
            <MaskedLine delay={0.4} className="outline-text text-[13vw] sm:text-[11vw] lg:text-[8.5rem]">
              {t('heroTitleB')}
            </MaskedLine>
            <MaskedLine delay={0.55} className="text-infinity-gradient text-[13vw] sm:text-[11vw] lg:text-[8.5rem]">
              {t('heroTitleC')}
            </MaskedLine>
          </h1>
        </motion.div>

        <FadeIn delay={0.85}>
          <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-slate-600" data-testid="hero-subtitle">
            {t('heroSub')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              data-testid="hero-quote-button"
              onClick={() => navigate('/contact')}
              className="group flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:bg-pink-600 active:scale-95"
            >
              {t('ctaQuote')}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
            </button>
            <button
              data-testid="hero-products-button"
              onClick={() => navigate('/products')}
              className="glass-card flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-slate-800 transition-all duration-300 hover:shadow-xl active:scale-95"
            >
              {t('ctaProducts')}
              <ArrowRight size={16} />
            </button>
          </div>
        </FadeIn>

        <div className="relative mt-10 hidden h-[26rem] lg:block">
          <motion.div style={{ y: imgY }} className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-tr from-pink-500/25 via-sky-400/25 to-amber-400/25 blur-3xl" />
              <img
                src={images.hero}
                alt="Infinitives Healthcare finished formulation"
                data-testid="hero-product-image"
                className="h-[24rem] w-72 rounded-[2.5rem] border-4 border-white object-cover shadow-2xl shadow-slate-900/25"
              />
            </motion.div>
          </motion.div>

          <FadeIn delay={1.05} className="absolute left-8 top-8 z-20">
            <div className="glass-card animate-float w-64 rounded-3xl p-5" data-testid="hero-card-formulation">
              <div className="flex items-center gap-3">
                <img src={images.gummies} alt="Gummies" className="h-12 w-12 rounded-2xl object-cover" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{t('heroCard1Title')}</p>
                  <p className="text-xs text-slate-500">{t('heroCard1Sub')}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={1.2} className="absolute right-8 top-24 z-20">
            <div className="glass-card animate-float-slow w-60 rounded-3xl p-5" data-testid="hero-card-quality">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-600/10 text-pink-600">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t('heroCard2Title')}</p>
                  <p className="text-xs text-slate-500">{t('heroCard2Sub')}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={1.35} className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2">
            <div className="flex gap-3" data-testid="hero-badges">
              {[t('heroBadge1'), t('heroBadge2'), t('heroBadge3')].map((b) => (
                <span key={b} className="glass-card rounded-full px-4 py-2 text-xs font-bold text-slate-700">{b}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="relative z-10 mt-auto border-t border-slate-200/60 bg-white/50 backdrop-blur">
        <Marquee items={marqueeItems} />
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
                <img src={c.image} alt={c.title} className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                <div className="font-display text-4xl font-extrabold text-infinity-gradient sm:text-5xl">{s.value}</div>
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
                <img src={d.image} alt={d.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

const Process = () => {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32" data-testid="process-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead overline={t('procOverline')} title={t('procTitle')} sub={t('procSub')} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.05}>
              <div className="group relative h-full rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-500/5" data-testid={`process-step-${p.step}`}>
                <span className="font-display text-5xl font-extrabold text-slate-200 transition-colors duration-300 group-hover:text-infinity-gradient">{p.step}</span>
                <h3 className="font-display mt-4 text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const { t } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32" data-testid="why-us-section">
      <SectionHead overline={t('whyOverline')} title={t('whyTitle')} sub={t('whySub')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {principles.map((p, i) => {
          const Icon = PRINCIPLE_ICONS[p.icon] || Factory;
          return (
            <Reveal key={p.number} delay={i * 0.06}>
              <div className="group h-full rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" data-testid={`principle-${p.number}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600/10 via-sky-500/10 to-amber-500/10 text-slate-800 transition group-hover:scale-110">
                  <Icon size={22} />
                </span>
                <h3 className="font-display mt-5 text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.description}</p>
              </div>
            </Reveal>
          );
        })}
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
            <div className="flex flex-wrap justify-center gap-3">
              {executives.map((e) => (
                <a key={e.tel} href={`tel:${e.tel}`} data-testid={`cta-call-${e.tel}`} className="glass-card flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold text-slate-700 transition hover:shadow-lg">
                  <Phone size={13} style={{ color: e.color }} /> {e.name.replace('Mr. ', '')}
                </a>
              ))}
            </div>
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
    <ProductShowcase />
    <Process />
    <WhyUs />
    <GlobalPresence />
    <Testimonials />
    <CTABand />
  </main>
);

export default Home;
