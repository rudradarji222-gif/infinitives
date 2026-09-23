import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';
import { Reveal, SectionHead } from '../components/Reveal';
import { PageHero } from './About';
import { useLang } from '../i18n/LanguageContext';
import { company, executives } from '../data/content';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Contact = () => {
  const { t } = useLang();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', inquiry_type: 'Third-Party Manufacturing', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (location.state?.prefill) {
      setForm((f) => ({ ...f, ...location.state.prefill }));
    }
  }, [location.state]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await axios.post(`${API}/inquiries`, form);
      toast.success(t('formSuccess'));
      setForm({ name: '', company: '', email: '', phone: '', inquiry_type: 'Third-Party Manufacturing', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.detail || t('formError'));
    } finally {
      setSending(false);
    }
  };

  const inquiryTypes = [t('typeThirdParty'), t('typeOem'), t('typeExport'), t('typeGeneral')];
  const typeValues = ['Third-Party Manufacturing', 'OEM / Private Label', 'Export Inquiry', 'General'];

  const inputCls = 'w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10';

  return (
    <main data-testid="contact-page">
      <PageHero overline={t('navContact')} title={t('contactTitle')} sub={t('contactSub')} />

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8" data-testid="contact-content">
        <SectionHead overline={t('execTitle')} title="Three divisions. Three direct lines." />
        <div className="mb-20 grid gap-5 md:grid-cols-3">
          {executives.map((e, i) => (
            <Reveal key={e.tel} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1.5 hover:shadow-xl" data-testid={`exec-card-${i}`}>
                <span className="absolute right-0 top-0 h-24 w-24 rounded-bl-[3rem] opacity-15" style={{ backgroundColor: e.color }} />
                <span className="rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white" style={{ backgroundColor: e.color }}>
                  {e.role}
                </span>
                <h3 className="font-display mt-5 text-2xl font-extrabold text-slate-900">{e.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{e.badge}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`tel:${e.tel}`} data-testid={`exec-call-${i}`} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-pink-600">
                    <Phone size={13} /> {e.phone}
                  </a>
                  <a href={`https://wa.me/${e.tel.replace('+', '')}`} target="_blank" rel="noreferrer" data-testid={`exec-whatsapp-${i}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600">
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <form onSubmit={submit} className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 sm:p-10" data-testid="inquiry-form">
              <h3 className="font-display text-2xl font-extrabold text-slate-900">Send an inquiry</h3>
              <p className="mt-2 text-sm text-slate-500">
                Delivered straight to <span className="font-bold text-pink-600">{company.email}</span>
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500" htmlFor="inq-name">{t('formName')} *</label>
                  <input id="inq-name" data-testid="inquiry-name-input" required minLength={2} value={form.name} onChange={set('name')} className={inputCls} placeholder="John Carter" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500" htmlFor="inq-company">{t('formCompany')}</label>
                  <input id="inq-company" data-testid="inquiry-company-input" value={form.company} onChange={set('company')} className={inputCls} placeholder="Your brand" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500" htmlFor="inq-email">{t('formEmail')} *</label>
                  <input id="inq-email" data-testid="inquiry-email-input" required type="email" value={form.email} onChange={set('email')} className={inputCls} placeholder="you@brand.com" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500" htmlFor="inq-phone">{t('formPhone')} *</label>
                  <input id="inq-phone" data-testid="inquiry-phone-input" required minLength={5} value={form.phone} onChange={set('phone')} className={inputCls} placeholder="+91 00000 00000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500" htmlFor="inq-type">{t('formType')}</label>
                  <select
                    id="inq-type"
                    data-testid="inquiry-type-select"
                    value={typeValues[inquiryTypes.findIndex((x) => x === form.inquiry_type)] ?? form.inquiry_type}
                    onChange={set('inquiry_type')}
                    className={inputCls}
                  >
                    {typeValues.map((v, i) => (
                      <option key={v} value={v} data-testid={`inquiry-type-option-${i}`}>{inquiryTypes[i]}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500" htmlFor="inq-message">{t('formMessage')} *</label>
                  <textarea id="inq-message" data-testid="inquiry-message-input" required minLength={5} rows={5} value={form.message} onChange={set('message')} className={`${inputCls} resize-none`} placeholder="Dosage form, quantity, packaging, target market…" />
                </div>
              </div>
              <button
                type="submit"
                data-testid="inquiry-submit-button"
                disabled={sending}
                className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 via-sky-600 to-amber-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-pink-600/20 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="transition-transform group-hover:translate-x-1" />}
                {sending ? t('formSending') : t('formSubmit')}
              </button>
            </form>
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={0.1}>
              <div className="rounded-[2.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-100" data-testid="contact-email-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600/10 text-pink-600"><Mail size={20} /></span>
                <h4 className="font-display mt-4 text-lg font-bold text-slate-900">Email us</h4>
                <a href={`mailto:${company.email}`} data-testid="contact-email-link" className="mt-1 block break-all text-sm font-semibold text-sky-600 hover:underline">
                  {company.email}
                </a>
                <p className="mt-2 text-xs text-slate-400">We respond within 24 hours on business days.</p>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="rounded-[2.5rem] border-2 border-dashed border-amber-300 bg-amber-50/60 p-8" data-testid="contact-address-card">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600"><MapPin size={20} /></span>
                <h4 className="font-display mt-4 text-lg font-bold text-slate-900">{t('addressTitle')}</h4>
                <p className="mt-1 text-sm italic text-slate-500">{t('addressPending')}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
