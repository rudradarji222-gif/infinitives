import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Pill, Tablets, Droplet, Candy, Droplets, Wheat, Package, Zap,
  Clock3, AlertTriangle, CheckCircle2, Boxes,
} from 'lucide-react';
import { Reveal, SectionHead } from './Reveal';

const DOSAGE_FORMS = [
  { id: 'tablets', name: 'Tablets', icon: Pill, weeks: 3 },
  { id: 'capsules', name: 'Capsules', icon: Tablets, weeks: 4 },
  { id: 'softgels', name: 'Softgels', icon: Droplet, weeks: 5 },
  { id: 'gummies', name: 'Gummies', icon: Candy, weeks: 4 },
  { id: 'syrups', name: 'Syrups & Liquids', icon: Droplets, weeks: 3 },
  { id: 'powders', name: 'Protein Powders', icon: Wheat, weeks: 3 },
  { id: 'sachets', name: 'Sachets', icon: Package, weeks: 3 },
  { id: 'effervescent', name: 'Effervescent', icon: Zap, weeks: 4 },
];

const PACKAGING = [
  { id: 'bottle', name: 'Bottle', icon: Package },
  { id: 'blister', name: 'Blister Pack', icon: Boxes },
  { id: 'jar', name: 'Jar', icon: Package },
  { id: 'sachet', name: 'Sachet', icon: Package },
  { id: 'tube', name: 'Effervescent Tube', icon: Package },
  { id: 'pouch', name: 'Pouch', icon: Package },
];

const PRESETS = [50000, 100000, 500000, 1000000];

const BatchEstimator = () => {
  const navigate = useNavigate();
  const [dosage, setDosage] = useState('tablets');
  const [qty, setQty] = useState(100000);
  const [pack, setPack] = useState('Bottle');

  const form = DOSAGE_FORMS.find((d) => d.id === dosage);
  const weeks = form.weeks + Math.ceil(qty / 250000);
  const belowMoq = qty < 50000;

  const send = () => {
    navigate('/contact', {
      state: {
        prefill: {
          inquiry_type: 'Third-Party Manufacturing',
          message: `Batch estimate request — Dosage form: ${form.name} | Quantity: ${qty.toLocaleString('en-IN')} units | Packaging: ${pack} | Estimated lead time: ${weeks}-${weeks + 2} weeks. Please share a detailed quotation.`,
        },
      },
    });
  };

  const SummaryRow = ({ label, value, testid }) => (
    <div className="flex items-center justify-between border-b border-white/10 py-4">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="font-display text-lg font-extrabold text-white"
        data-testid={testid}
      >
        {value}
      </motion.span>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32" data-testid="batch-estimator-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          overline="Batch estimator"
          title="Build your batch in 10 seconds"
          sub="Pick a dosage form, set your quantity, choose packaging — get an instant manufacturing plan you can send straight to our team."
        />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-10">
            <Reveal>
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Step 01 — Dosage form</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {DOSAGE_FORMS.map((d) => {
                    const Icon = d.icon;
                    const active = dosage === d.id;
                    return (
                      <button
                        key={d.id}
                        data-testid={`estimator-dosage-${d.id}`}
                        onClick={() => setDosage(d.id)}
                        className={`group flex flex-col items-center gap-2.5 rounded-3xl border p-5 text-center transition-all duration-300 active:scale-95 ${
                          active
                            ? 'border-transparent bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                            : 'border-slate-200 bg-[#f8fafc] text-slate-700 hover:border-pink-300 hover:-translate-y-1'
                        }`}
                      >
                        <Icon size={24} className={active ? 'text-amber-400' : 'text-slate-400 transition group-hover:text-pink-500'} />
                        <span className="text-xs font-bold">{d.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Step 02 — Quantity</p>
                <div className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-6">
                  <div className="flex items-end justify-between">
                    <motion.span
                      key={qty}
                      initial={{ opacity: 0.4, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-display text-4xl font-extrabold text-infinity-gradient sm:text-5xl"
                      data-testid="estimator-quantity-display"
                    >
                      {qty.toLocaleString('en-IN')}
                    </motion.span>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">units</span>
                  </div>
                  <input
                    type="range"
                    min={25000}
                    max={1000000}
                    step={25000}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    data-testid="estimator-quantity-slider"
                    className="mt-5 w-full accent-pink-600"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        data-testid={`estimator-preset-${p}`}
                        onClick={() => setQty(p)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                          qty === p ? 'border-pink-600 bg-pink-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-pink-300'
                        }`}
                      >
                        {p >= 1000000 ? '1M' : `${p / 1000}K`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Step 03 — Packaging</p>
                <div className="flex flex-wrap gap-3">
                  {PACKAGING.map((p) => {
                    const active = pack === p.name;
                    return (
                      <button
                        key={p.id}
                        data-testid={`estimator-packaging-${p.id}`}
                        onClick={() => setPack(p.name)}
                        className={`rounded-full border px-5 py-2.5 text-xs font-bold transition-all duration-300 active:scale-95 ${
                          active
                            ? 'border-transparent bg-gradient-to-r from-pink-600 to-sky-600 text-white shadow-lg shadow-pink-600/20'
                            : 'border-slate-200 bg-[#f8fafc] text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-28">
              <div className="dark-mesh relative overflow-hidden rounded-[2.5rem] p-8 text-white sm:p-10" data-testid="estimator-summary">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-600/25 blur-3xl" />
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Live summary</p>
                <h3 className="font-display mt-2 text-2xl font-extrabold">Your Manufacturing Plan</h3>
                <div className="mt-6">
                  <SummaryRow label="Dosage form" value={form.name} testid="estimator-summary-dosage" />
                  <SummaryRow label="Quantity" value={qty.toLocaleString('en-IN')} testid="estimator-summary-qty" />
                  <SummaryRow label="Packaging" value={pack} testid="estimator-summary-packaging" />
                  <div className="flex items-center justify-between py-4">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      <Clock3 size={14} /> Lead time
                    </span>
                    <motion.span
                      key={weeks}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-lg font-extrabold text-amber-400"
                      data-testid="estimator-lead-time"
                    >
                      {weeks}–{weeks + 2} weeks
                    </motion.span>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4" data-testid="estimator-moq-note">
                  {belowMoq ? (
                    <p className="flex items-start gap-2.5 text-xs leading-relaxed text-amber-300">
                      <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                      Below our standard 50,000-unit MOQ — pilot batches are still possible. Send it over and we will work something out.
                    </p>
                  ) : (
                    <p className="flex items-start gap-2.5 text-xs leading-relaxed text-emerald-300">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                      Meets our standard MOQ. This plan is ready for a formal quotation.
                    </p>
                  )}
                </div>
                <button
                  data-testid="estimator-send-button"
                  onClick={send}
                  className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 via-sky-600 to-amber-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-pink-600/25 transition hover:opacity-90 active:scale-[0.98]"
                >
                  Send this plan as an inquiry
                  <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default BatchEstimator;
