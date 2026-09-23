import { FlaskConical, Microscope, Thermometer, Lightbulb, FileCheck, Wand2 } from 'lucide-react';
import { Reveal, SectionHead } from '../components/Reveal';
import { PageHero } from './About';
import { useLang } from '../i18n/LanguageContext';
import { images, rndCapabilities, certifications } from '../data/content';
import Marquee from '../components/Marquee';
import LicenseSlider from '../components/LicenseSlider';

const ICONS = { FlaskConical, Microscope, Thermometer, Lightbulb, FileCheck, Wand2 };

const RnD = () => {
  const { t } = useLang();
  return (
    <main data-testid="rnd-page">
      <PageHero overline={t('navRnd')} title={t('rndPageTitle')} sub={t('rndPageSub')} />

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" data-testid="rnd-lab-section">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-pink-600">In-house science</span>
            <h2 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Where every formulation is born — and proven
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Our R&D and quality laboratories sit at the heart of the plant. From first prototype to validated stability data, every batch is backed by analytical evidence before it reaches your market.
            </p>
            <ul className="mt-6 space-y-3 text-sm font-semibold text-slate-700">
              {['HPLC, GC & UV analytical validation', 'Real-time & accelerated stability chambers', 'Complete CTD/eCTD dossier documentation', 'Custom prototype development in weeks, not months'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-sky-500" /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative">
              <img src={images.lab} alt="Infinitives Healthcare laboratory" loading="lazy" className="h-[26rem] w-full rounded-[2.5rem] object-cover shadow-2xl shadow-slate-900/15" />
              <div className="glass-card absolute -bottom-6 right-6 rounded-3xl px-6 py-4">
                <span className="font-display text-2xl font-extrabold text-infinity-gradient">100%</span>
                <p className="text-xs font-semibold text-slate-600">Batch-tested before dispatch</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28" data-testid="rnd-capabilities-section">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHead overline="Capabilities" title="Six pillars of our R&D engine" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rndCapabilities.map((c, i) => {
              const Icon = ICONS[c.icon] || FlaskConical;
              return (
                <Reveal key={c.title} delay={i * 0.06}>
                  <div className="group h-full rounded-3xl border border-slate-100 bg-[#f8fafc] p-8 transition hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-xl" data-testid={`rnd-capability-${i}`}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-pink-600 text-white transition group-hover:scale-110">
                      <Icon size={20} />
                    </span>
                    <h3 className="font-display mt-5 text-lg font-bold text-slate-900">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dark-mesh py-20 sm:py-28" data-testid="rnd-certifications-section">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <SectionHead dark overline="Quality & compliance" title={t('certTitle')} sub="Audited, certified and documented for regulated markets worldwide." />
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {certifications.map((c, i) => (
              <Reveal key={c} delay={i * 0.04}>
                <div className="glass-dark flex h-24 items-center justify-center rounded-3xl transition hover:border-amber-400/50" data-testid={`cert-${i}`}>
                  <span className="font-display text-sm font-extrabold tracking-[0.14em] text-white">{c}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-14">
            <LicenseSlider dark />
          </Reveal>
        </div>
      </section>

      <div className="border-b border-slate-200/60">
        <Marquee items={['HPLC', 'GC', 'UV Spectroscopy', 'Stability Studies', 'CTD Dossiers', 'Microbiology', 'Assay Testing', 'Dissolution']} reverse />
      </div>
    </main>
  );
};

export default RnD;
