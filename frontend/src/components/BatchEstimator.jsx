import { useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Pill, Tablets, Droplet, Candy, Droplets, Wheat, Package, Zap,
  Clock3, CheckCircle2, UploadCloud, Loader2, FileCheck2, PartyPopper, Boxes, Pencil,
} from 'lucide-react';
import { Reveal, SectionHead } from './Reveal';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DOSAGE_FORMS = ['Tablets', 'Capsules', 'Softgels', 'Gummies', 'Syrups & Liquids', 'Protein Powders', 'Sachets', 'Effervescent'];
const DOSAGE_ICONS = { Tablets: Pill, Capsules: Tablets, Softgels: Droplet, Gummies: Candy, 'Syrups & Liquids': Droplets, 'Protein Powders': Wheat, Sachets: Package, Effervescent: Zap };
const DOSAGE_WEEKS = { Tablets: 3, Capsules: 4, Softgels: 5, Gummies: 4, 'Syrups & Liquids': 3, 'Protein Powders': 3, Sachets: 3, Effervescent: 4 };
const CATEGORIES = ['Pharmaceutical', 'Nutraceutical', 'Herbal', 'Food Supplement', 'Cosmetic'];
const MFG_TYPES = ['Contract Manufacturing', 'Third-Party Manufacturing', 'Private Label', 'Custom Formulation', 'Existing Formula'];
const DEV_REQS = ['I have a ready formulation', 'I need formulation development', 'I need a similar existing product'];
const PACKAGING = ['Bottle', 'Blister Pack', 'Jar', 'Sachet', 'Effervescent Tube', 'Pouch'];
const LABEL_REQS = ["Client's own branding", 'Private label', 'Artwork to be uploaded'];
const REG_DOCS = ['CTD / Dossier', 'GMP Certificate', 'COA (Certificate of Analysis)', 'Stability Data'];
const SHIPPING = ['EXW', 'FOB', 'CIF', 'Other'];
const PRESETS = [50000, 100000, 500000, 1000000];
const UPLOAD_SLOTS = [
  { kind: 'product_specification', label: 'Product specification' },
  { kind: 'formulation', label: 'Formulation' },
  { kind: 'artwork', label: 'Artwork' },
  { kind: 'rfq_document', label: 'RFQ / document' },
];

const STEPS = ['Product Details', 'Manufacturing', 'Packaging', 'Regulatory', 'Delivery', 'Contact Info', 'Review'];

const INITIAL = {
  dosage_form: 'Tablets', product_name: '', brand_name: '', category: 'Nutraceutical',
  composition: '', strength: '', active_count: '', target_market: '',
  quantity: 100000, mfg_type: 'Contract Manufacturing', dev_req: 'I have a ready formulation',
  packaging: 'Bottle', pack_size: '', pack_material: '', label_req: "Client's own branding",
  reg_required: false, has_registration: false, product_registered: false, reg_docs: [],
  dest_country: '', dest_port: '', shipping: 'FOB', delivery_date: '',
  name: '', company: '', email: '', phone: '', country: '', website: '', position: '', message: '',
  attachments: [],
};

const inputCls = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10';

const Chip = ({ active, onClick, children, testid }) => (
  <button
    type="button"
    data-testid={testid}
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 active:scale-95 ${
      active
        ? 'border-transparent bg-slate-900 text-white shadow-lg shadow-slate-900/20'
        : 'border-slate-200 bg-white text-slate-600 hover:border-pink-300 hover:text-slate-900'
    }`}
  >
    {children}
  </button>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
      {label} {required && <span className="text-pink-600">*</span>}
    </label>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange, testid }) => (
  <button
    type="button"
    data-testid={testid}
    onClick={() => onChange(!checked)}
    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-sky-300"
  >
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-gradient-to-r from-pink-600 to-sky-600' : 'bg-slate-200'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[1.4rem]' : 'left-0.5'}`} />
    </span>
  </button>
);

const UploadSlot = ({ slot, file, onFile }) => {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      fd.append('kind', slot.kind);
      const res = await axios.post(`${API}/rfq-upload`, fd);
      onFile({ kind: slot.kind, filename: res.data.filename, path: res.data.path });
      toast.success(`${slot.label} uploaded`);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <label
      data-testid={`rfq-upload-${slot.kind}`}
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-dashed px-4 py-3.5 transition ${
        file ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-[#f8fafc] hover:border-pink-300'
      }`}
    >
      <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
        {busy ? <Loader2 size={18} className="animate-spin text-pink-600" /> : file ? <FileCheck2 size={18} className="text-emerald-600" /> : <UploadCloud size={18} className="text-slate-400" />}
        <span>
          {slot.label}
          <span className="block text-[11px] font-normal text-slate-400">{file ? file.filename : 'PDF, image or doc · max 10 MB'}</span>
        </span>
      </span>
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{file ? 'Replace' : 'Browse'}</span>
      <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt" onChange={pick} />
    </label>
  );
};

const BatchEstimator = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState(null);

  const set = (key) => (e) => setData((d) => ({ ...d, [key]: e?.target ? e.target.value : e }));
  const setVal = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const weeks = (DOSAGE_WEEKS[data.dosage_form] || 3) + Math.ceil(data.quantity / 250000);
  const leadTime = `${weeks}-${weeks + 2} weeks`;
  const belowMoq = data.quantity < 50000;

  const contactValid = data.name.trim().length >= 2 && data.company.trim().length >= 2 && /\S+@\S+\.\S+/.test(data.email) && data.phone.trim().length >= 5 && data.country.trim().length >= 2;

  const toggleRegDoc = (doc) =>
    setData((d) => ({ ...d, reg_docs: d.reg_docs.includes(doc) ? d.reg_docs.filter((x) => x !== doc) : [...d.reg_docs, doc] }));

  const setAttachment = (att) =>
    setData((d) => ({ ...d, attachments: [...d.attachments.filter((a) => a.kind !== att.kind), att] }));

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = { ...data, lead_time: leadTime };
      const res = await axios.post(`${API}/rfq`, payload);
      setInquiryId(res.data.inquiry_id);
      toast.success('Inquiry submitted successfully');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setData(INITIAL);
    setStep(0);
    setInquiryId(null);
  };

  const reviewRows = useMemo(() => {
    const att = data.attachments.map((a) => a.filename).filter(Boolean).join(', ');
    return [
      ['Product / Molecule', data.product_name], ['Generic / Brand Name', data.brand_name],
      ['Category', data.category], ['Dosage Form', data.dosage_form],
      ['Composition / Formulation', data.composition], ['Strength', data.strength],
      ['Active Ingredients', data.active_count], ['Target Market', data.target_market],
      ['Manufacturing Type', data.mfg_type], ['Development Requirement', data.dev_req],
      ['Quantity', `${data.quantity.toLocaleString('en-IN')} units`],
      ['Packaging', data.packaging], ['Pack Size', data.pack_size], ['Packaging Material', data.pack_material],
      ['Label Requirement', data.label_req],
      ['Registration Required', data.reg_required ? 'Yes' : 'No'],
      ['Client Has Registration', data.has_registration ? 'Yes' : 'No'],
      ['Product Already Registered', data.product_registered ? 'Yes' : 'No'],
      ['Documentation', data.reg_docs.join(', ')],
      ['Destination Country', data.dest_country], ['City / Port', data.dest_port],
      ['Shipping Terms', data.shipping], ['Required Delivery Date', data.delivery_date],
      ['Estimated Lead Time', leadTime],
      ['Full Name', data.name], ['Company', data.company], ['Business Email', data.email],
      ['WhatsApp / Phone', data.phone], ['Country', data.country], ['Website', data.website],
      ['Job Position', data.position], ['Additional Requirements', data.message],
      ['Attachments', att],
    ].filter(([, v]) => v && String(v).trim());
  }, [data, leadTime]);

  const SummaryRow = ({ label, value, accent = false }) => (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-right font-display text-sm font-extrabold ${accent ? 'text-amber-400' : 'text-white'}`}
      >
        {value || '—'}
      </motion.span>
    </div>
  );

  const stepBody = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <Field label="Dosage Form">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {DOSAGE_FORMS.map((f) => {
                  const Icon = DOSAGE_ICONS[f];
                  const active = data.dosage_form === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      data-testid={`rfq-dosage-${f.toLowerCase().replace(/[^a-z]/g, '-')}`}
                      onClick={() => setVal('dosage_form', f)}
                      className={`flex flex-col items-center gap-2 rounded-3xl border p-4 text-center transition-all duration-300 active:scale-95 ${
                        active ? 'border-transparent bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'border-slate-200 bg-white text-slate-700 hover:-translate-y-1 hover:border-pink-300'
                      }`}
                    >
                      <Icon size={22} className={active ? 'text-amber-400' : 'text-slate-400'} />
                      <span className="text-[11px] font-bold">{f}</span>
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product / Molecule Name"><input data-testid="rfq-product-name" className={inputCls} placeholder="e.g. Vitamin D3 Tablets" value={data.product_name} onChange={set('product_name')} /></Field>
              <Field label="Generic / Brand Name"><input data-testid="rfq-brand-name" className={inputCls} placeholder="e.g. Cholecalciferol" value={data.brand_name} onChange={set('brand_name')} /></Field>
            </div>
            <Field label="Product Category">
              <div className="flex flex-wrap gap-2.5">
                {CATEGORIES.map((c) => <Chip key={c} testid={`rfq-category-${c.toLowerCase().replace(/ /g, '-')}`} active={data.category === c} onClick={() => setVal('category', c)}>{c}</Chip>)}
              </div>
            </Field>
            <Field label="Composition / Formulation"><textarea data-testid="rfq-composition" rows={2} className={`${inputCls} resize-none`} placeholder="e.g. Cholecalciferol 60,000 IU per tablet" value={data.composition} onChange={set('composition')} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Strength"><input data-testid="rfq-strength" className={inputCls} placeholder="e.g. 500 mg / 60,000 IU" value={data.strength} onChange={set('strength')} /></Field>
              <Field label="No. of Active Ingredients"><input data-testid="rfq-active-count" className={inputCls} placeholder="e.g. 3" value={data.active_count} onChange={set('active_count')} /></Field>
              <Field label="Target Market / Country"><input data-testid="rfq-target-market" className={inputCls} placeholder="e.g. UAE" value={data.target_market} onChange={set('target_market')} /></Field>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <Field label="Quantity (units)">
              <div className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-6">
                <div className="flex items-end justify-between">
                  <motion.span key={data.quantity} initial={{ opacity: 0.4, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-4xl font-extrabold text-infinity-gradient" data-testid="rfq-quantity-display">
                    {data.quantity.toLocaleString('en-IN')}
                  </motion.span>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">units</span>
                </div>
                <input type="range" min={25000} max={1000000} step={25000} value={data.quantity} onChange={(e) => setVal('quantity', Number(e.target.value))} data-testid="rfq-quantity-slider" className="mt-5 w-full accent-pink-600" />
                <div className="mt-4 flex flex-wrap gap-2">
                  {PRESETS.map((p) => <Chip key={p} testid={`rfq-preset-${p}`} active={data.quantity === p} onClick={() => setVal('quantity', p)}>{p >= 1000000 ? '1M' : `${p / 1000}K`}</Chip>)}
                </div>
                {belowMoq && <p className="mt-4 text-xs font-semibold text-amber-600">Below our standard 50,000-unit MOQ — pilot batches are still possible.</p>}
              </div>
            </Field>
            <Field label="Manufacturing Type">
              <div className="flex flex-wrap gap-2.5">
                {MFG_TYPES.map((m) => <Chip key={m} testid={`rfq-mfg-${m.toLowerCase().replace(/[^a-z]/g, '-')}`} active={data.mfg_type === m} onClick={() => setVal('mfg_type', m)}>{m}</Chip>)}
              </div>
            </Field>
            <Field label="Development Requirement">
              <div className="space-y-2.5">
                {DEV_REQS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    data-testid={`rfq-devreq-${r.toLowerCase().replace(/[^a-z]/g, '-')}`}
                    onClick={() => setVal('dev_req', r)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition ${
                      data.dev_req === r ? 'border-transparent bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${data.dev_req === r ? 'border-amber-400 bg-amber-400' : 'border-slate-300'}`}>
                      {data.dev_req === r && <CheckCircle2 size={12} className="text-slate-900" />}
                    </span>
                    {r}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <Field label="Packaging Type">
              <div className="flex flex-wrap gap-2.5">
                {PACKAGING.map((p) => <Chip key={p} testid={`rfq-packaging-${p.toLowerCase().replace(/[^a-z]/g, '-')}`} active={data.packaging === p} onClick={() => setVal('packaging', p)}>{p}</Chip>)}
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Pack Size"><input data-testid="rfq-pack-size" className={inputCls} placeholder="e.g. 30 tablets / bottle" value={data.pack_size} onChange={set('pack_size')} /></Field>
              <Field label="Packaging Material"><input data-testid="rfq-pack-material" className={inputCls} placeholder="e.g. HDPE bottle, Alu-Alu blister" value={data.pack_material} onChange={set('pack_material')} /></Field>
            </div>
            <Field label="Label Requirement">
              <div className="flex flex-wrap gap-2.5">
                {LABEL_REQS.map((l) => <Chip key={l} testid={`rfq-label-${l.toLowerCase().replace(/[^a-z]/g, '-')}`} active={data.label_req === l} onClick={() => setVal('label_req', l)}>{l}</Chip>)}
              </div>
            </Field>
            <div className="rounded-2xl bg-sky-50 p-4 text-xs font-semibold leading-relaxed text-sky-700">
              Example plan: {data.pack_size || '30 tablets'} × {data.quantity.toLocaleString('en-IN')} {data.packaging.toLowerCase()}s · {data.label_req}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <p className="rounded-2xl bg-pink-50 p-4 text-xs font-semibold text-pink-700">
              Regulatory requirements{data.target_market ? ` for ${data.target_market}` : ''} — answer for your target market.
            </p>
            <div className="space-y-3">
              <Toggle label="Registration required in target market?" checked={data.reg_required} onChange={(v) => setVal('reg_required', v)} testid="rfq-reg-required" />
              <Toggle label="Client already has registration?" checked={data.has_registration} onChange={(v) => setVal('has_registration', v)} testid="rfq-has-registration" />
              <Toggle label="Product already registered?" checked={data.product_registered} onChange={(v) => setVal('product_registered', v)} testid="rfq-product-registered" />
            </div>
            <Field label="Regulatory Documentation Required">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {REG_DOCS.map((doc) => {
                  const active = data.reg_docs.includes(doc);
                  return (
                    <button
                      key={doc}
                      type="button"
                      data-testid={`rfq-regdoc-${doc.toLowerCase().replace(/[^a-z]/g, '-')}`}
                      onClick={() => toggleRegDoc(doc)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        active ? 'border-transparent bg-slate-900 text-white shadow-lg' : 'border-slate-200 bg-white text-slate-600 hover:border-pink-300'
                      }`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${active ? 'border-emerald-400 bg-emerald-400' : 'border-slate-300'}`}>
                        {active && <CheckCircle2 size={12} className="text-slate-900" />}
                      </span>
                      {doc}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Destination Country"><input data-testid="rfq-dest-country" className={inputCls} placeholder="e.g. UAE" value={data.dest_country} onChange={set('dest_country')} /></Field>
              <Field label="Destination City / Port"><input data-testid="rfq-dest-port" className={inputCls} placeholder="e.g. Jebel Ali, Dubai" value={data.dest_port} onChange={set('dest_port')} /></Field>
            </div>
            <Field label="Shipping Requirement">
              <div className="flex flex-wrap gap-2.5">
                {SHIPPING.map((s) => <Chip key={s} testid={`rfq-shipping-${s.toLowerCase()}`} active={data.shipping === s} onClick={() => setVal('shipping', s)}>{s}</Chip>)}
              </div>
            </Field>
            <Field label="Required Delivery Date"><input type="date" data-testid="rfq-delivery-date" className={inputCls} value={data.delivery_date} onChange={set('delivery_date')} /></Field>
            <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-xs font-semibold text-amber-700">
              <Clock3 size={16} className="shrink-0" /> Estimated production lead time for this configuration: {leadTime} (excluding shipping).
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required><input data-testid="rfq-name" className={inputCls} placeholder="Your full name" value={data.name} onChange={set('name')} /></Field>
              <Field label="Company Name" required><input data-testid="rfq-company" className={inputCls} placeholder="e.g. ABC Healthcare LLC" value={data.company} onChange={set('company')} /></Field>
              <Field label="Business Email" required><input type="email" data-testid="rfq-email" className={inputCls} placeholder="buyer@company.com" value={data.email} onChange={set('email')} /></Field>
              <Field label="WhatsApp / Phone" required><input data-testid="rfq-phone" className={inputCls} placeholder="+971 5X XXX XXXX" value={data.phone} onChange={set('phone')} /></Field>
              <Field label="Country" required><input data-testid="rfq-country" className={inputCls} placeholder="e.g. UAE" value={data.country} onChange={set('country')} /></Field>
              <Field label="Job Position"><input data-testid="rfq-position" className={inputCls} placeholder="e.g. Purchase Manager" value={data.position} onChange={set('position')} /></Field>
            </div>
            <Field label="Website"><input data-testid="rfq-website" className={inputCls} placeholder="https://yourcompany.com" value={data.website} onChange={set('website')} /></Field>
            <Field label="Message / Additional Requirements"><textarea rows={3} data-testid="rfq-message" className={`${inputCls} resize-none`} placeholder="Anything else we should know…" value={data.message} onChange={set('message')} /></Field>
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Optional uploads</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {UPLOAD_SLOTS.map((s) => (
                  <UploadSlot key={s.kind} slot={s} file={data.attachments.find((a) => a.kind === s.kind)} onFile={setAttachment} />
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <div className="border-b border-slate-100 bg-[#f8fafc] px-6 py-4">
                <h4 className="font-display text-lg font-extrabold text-slate-900">Review your inquiry</h4>
                <p className="text-xs text-slate-500">Confirm everything before it reaches our business development team.</p>
              </div>
              <div className="max-h-[26rem] overflow-y-auto" data-testid="rfq-review-table">
                {reviewRows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[40%_60%] gap-3 border-b border-slate-50 px-6 py-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{k}</span>
                    <span className="text-sm font-semibold text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32" data-testid="batch-estimator-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          overline="Batch estimator"
          title="Build your batch — get a formal RFQ"
          sub="Seven quick steps: product, manufacturing, packaging, regulatory, delivery and your details. Submit once — it lands directly in our inbox with an inquiry ID."
        />

        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            {inquiryId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[2.5rem] border border-emerald-200 bg-emerald-50/60 p-10 text-center"
                data-testid="rfq-success-panel"
              >
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-white shadow-xl shadow-emerald-500/30">
                  <PartyPopper size={34} />
                </span>
                <h3 className="font-display mt-6 text-3xl font-extrabold text-slate-900">Inquiry Submitted Successfully</h3>
                <p className="mt-2 text-sm text-slate-600">Thank you for your inquiry.</p>
                <div className="font-display mx-auto mt-6 w-fit rounded-2xl bg-slate-900 px-8 py-4 text-2xl font-extrabold tracking-wide text-amber-400" data-testid="rfq-inquiry-id">
                  {inquiryId}
                </div>
                <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-slate-500">
                  Our business development team will review your requirements and contact you within 24 hours. A copy has been sent to info@infinitveshealthcare.com.
                </p>
                <button data-testid="rfq-new-button" onClick={reset} className="mt-8 rounded-full border border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition hover:border-pink-400 hover:text-pink-600">
                  Start another inquiry
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-8" data-testid="rfq-progress">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    <span>Step {step + 1} of {STEPS.length}</span>
                    <span className="text-pink-600">{STEPS[step]}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-pink-600 via-sky-500 to-amber-400"
                      animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    data-testid={`rfq-step-${step}`}
                  >
                    {stepBody()}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-9 flex items-center justify-between">
                  <button
                    type="button"
                    data-testid="rfq-back-button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-400 disabled:opacity-30"
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      data-testid="rfq-next-button"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={step === 5 && !contactValid}
                      className="group flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-600 active:scale-95 disabled:opacity-40"
                    >
                      {step === 5 ? 'Review Inquiry' : 'Continue'} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        data-testid="rfq-edit-button"
                        onClick={() => setStep(0)}
                        className="flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-400"
                      >
                        <Pencil size={14} /> Edit Requirements
                      </button>
                      <button
                        type="button"
                        data-testid="rfq-submit-button"
                        onClick={submit}
                        disabled={submitting}
                        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 via-sky-600 to-amber-500 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-pink-600/25 transition hover:opacity-90 active:scale-95 disabled:opacity-60"
                      >
                        {submitting ? <Loader2 size={15} className="animate-spin" /> : <Boxes size={15} />}
                        {submitting ? 'Submitting…' : 'Submit Inquiry'}
                      </button>
                    </div>
                  )}
                </div>
                {step === 5 && !contactValid && (
                  <p className="mt-3 text-right text-xs font-semibold text-pink-600" data-testid="rfq-validation-note">
                    Fill name, company, valid email, phone and country to continue.
                  </p>
                )}
              </>
            )}
          </div>

          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-28">
              <div className="dark-mesh relative overflow-hidden rounded-[2.5rem] p-8 text-white" data-testid="estimator-summary">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-600/25 blur-3xl" />
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Live summary</p>
                <h3 className="font-display mt-2 text-2xl font-extrabold">Your Manufacturing Plan</h3>
                <div className="mt-5">
                  <SummaryRow label="Product" value={data.product_name || data.dosage_form} />
                  <SummaryRow label="Category" value={data.category} />
                  <SummaryRow label="Strength" value={data.strength} />
                  <SummaryRow label="Quantity" value={`${data.quantity.toLocaleString('en-IN')} units`} />
                  <SummaryRow label="Manufacturing" value={data.mfg_type} />
                  <SummaryRow label="Packaging" value={`${data.packaging}${data.pack_size ? ` · ${data.pack_size}` : ''}`} />
                  <SummaryRow label="Target Market" value={data.target_market} />
                  <SummaryRow label="Shipping" value={`${data.shipping}${data.dest_country ? ` · ${data.dest_country}` : ''}`} />
                  <div className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      <Clock3 size={13} /> Lead time
                    </span>
                    <motion.span key={leadTime} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-sm font-extrabold text-amber-400" data-testid="estimator-lead-time">
                      {leadTime}
                    </motion.span>
                  </div>
                </div>
                <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-[11px] leading-relaxed text-slate-400">
                  {belowMoq
                    ? 'Below standard 50,000-unit MOQ — pilot batches are still possible.'
                    : 'Meets our standard MOQ. This plan is ready for a formal quotation.'}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default BatchEstimator;
