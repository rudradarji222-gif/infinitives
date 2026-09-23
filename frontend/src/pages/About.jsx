import { Factory, Sparkles, Award, Users } from 'lucide-react';
import Marquee from '../components/Marquee';
import { Reveal, SectionHead } from '../components/Reveal';
import { useLang } from '../i18n/LanguageContext';
import { images, milestones, infrastructure, expertise, marqueeItems, certifications } from '../data/content';
import { Beaker, Tags, Globe } from 'lucide-react';

const MILESTONE_ICONS = { Sparkles, Factory, Award, Users };
const EXPERTISE_ICONS = { Beaker, Tags, Factory, Globe };

const PageHero = ({ overline, title, sub }) => (
  <section className="hero-mesh relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
    <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
      <Reveal>
        <span className="glass-card rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-700">{overline}</span>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="font-display mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">{title}</h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600">{sub}</p>
      </Reveal>
    </div>
  </section>
);

export { PageHero };

const About = () => {
  const { t } = useLang();
  return (
    <main data-testid="about-page">
      <PageHero overline={t('navAbout')} title={t('aboutPageTitle')} sub={t('aboutPageSub')} />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" data-testid="about-story">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img src={images.facility} alt="Infinitives Healthcare facility" loading="lazy" className="h-[28rem] w-full rounded-[2.5rem] object-cover shadow-2xl shadow-slate-900/15" />
              <div className="glass-card absolute -bottom-6 left-6 rounded-3xl px-6 py-4">
                <span className="font-display text-2xl font-extrabold text-infinity-gradient">15,000 sq.ft</span>
                <p className="text-xs font-semibold text-slate-600">State-of-the-art plant, Gujarat, India</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-pink-600">Our story</span>
            <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              A growth ally, not just a manufacturer
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              At Infinitives Healthcare, our vision is to redefine the standards of nutraceutical manufacturing through science, integrity and innovation. From day one, we set out to partner with brands not just as a manufacturer, but as a true growth ally.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Every product that leaves our facility carries years of research, uncompromising quality checks and the passion of a team that genuinely believes in the power of good health — backed by globally recognized certifications including USFDA, WHO-GMP, HACCP, HALAL, KOSHER, ISO 22000:2018 and NAFDAC.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              As we expand across the globe, our commitment stays simple — deliver world-class products, honor every partnership and build a healthier tomorrow, one formulation at a time.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28" data-testid="about-milestones">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead overline="The journey" title="Milestones that made us" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => {
              const Icon = MILESTONE_ICONS[m.icon] || Sparkles;
              return (
                <Reveal key={m.title} delay={i * 0.07}>
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-[#f8fafc] p-7 transition hover:-translate-y-1.5 hover:shadow-xl" data-testid={`milestone-${i}`}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600">{m.year}</span>
                    <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 via-sky-500 to-amber-500 text-white">
                      <Icon size={20} />
                    </span>
                    <h3 className="font-display mt-4 text-lg font-bold text-slate-900">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{m.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dark-mesh py-20 sm:py-28" data-testid="about-infrastructure">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead dark overline="Infrastructure" title="Inside the Infinitives plant" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infrastructure.map((f, i) => (
              <Reveal key={f.label} delay={i * 0.05}>
                <div className="glass-dark rounded-3xl p-7 transition hover:border-sky-400/40" data-testid={`infra-${i}`}>
                  <span className="font-display text-2xl font-extrabold text-white">{f.label}</span>
                  <p className="mt-2 text-sm text-slate-400">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" data-testid="about-expertise">
        <SectionHead overline="Expertise" title="Four ways we power your brand" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {expertise.map((e, i) => {
            const Icon = EXPERTISE_ICONS[e.icon] || Beaker;
            return (
              <Reveal key={e.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1.5 hover:shadow-xl" data-testid={`expertise-${i}`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white"><Icon size={20} /></span>
                  <h3 className="font-display mt-4 text-lg font-bold text-slate-900">{e.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{e.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <div className="border-y border-slate-200/60 bg-white/50">
        <Marquee items={certifications} reverse />
      </div>
      <div className="border-b border-slate-200/60">
        <Marquee items={marqueeItems} />
      </div>
    </main>
  );
};

export default About;
