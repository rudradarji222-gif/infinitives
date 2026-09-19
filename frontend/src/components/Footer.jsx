import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';
import Logo from './Logo';
import { company, navLinks, executives, certifications } from '../data/content';
import { useLang } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="dark-mesh relative overflow-hidden text-white" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">{t('footTagline')}</p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Facebook, href: company.socials.facebook, id: 'facebook' },
                { icon: Linkedin, href: company.socials.linkedin, id: 'linkedin' },
                { icon: Instagram, href: company.socials.instagram, id: 'instagram' },
              ].map(({ icon: Icon, href, id }) => (
                <a
                  key={id}
                  href={href}
                  data-testid={`social-${id}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-pink-500 hover:text-pink-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{t('footLinks')}</h4>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    data-testid={`footer-link-${l.key.toLowerCase()}`}
                    className="text-sm font-semibold text-slate-300 transition hover:text-white"
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{t('footContact')}</h4>
            <div className="mt-5 space-y-4">
              <a
                href={`mailto:${company.email}`}
                data-testid="footer-email-link"
                className="flex items-center gap-3 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600/20 text-pink-400"><Mail size={15} /></span>
                {company.email}
              </a>
              {executives.map((e) => (
                <a
                  key={e.tel}
                  href={`tel:${e.tel}`}
                  data-testid={`footer-phone-${e.tel}`}
                  className="flex items-center gap-3 text-sm text-slate-400 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600/20 text-sky-400"><Phone size={15} /></span>
                  <span>{e.phone} <span className="text-slate-500">· {e.role}</span></span>
                </a>
              ))}
              <div className="flex items-start gap-3 text-sm text-slate-500" data-testid="footer-address-placeholder">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400"><MapPin size={15} /></span>
                <span className="pt-2 italic">{t('addressPending')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-2 border-t border-white/10 pt-8">
          {certifications.map((c) => (
            <span key={c} className="rounded-full border border-white/10 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.16em] text-slate-400">
              {c}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} {company.name}. {t('footRights')}</span>
          <span className="font-display font-bold tracking-wide text-infinity-gradient">{company.tagline}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
