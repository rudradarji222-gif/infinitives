import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';
import { navLinks } from '../data/content';
import { useLang } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/translations';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-card shadow-lg shadow-slate-900/5' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" data-testid="nav-logo-link">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" data-testid="nav-links-desktop">
          {navLinks.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              data-testid={`nav-link-${l.key.toLowerCase()}`}
              className={({ isActive }) =>
                `text-[13px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                  isActive ? 'text-pink-600' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <button
              data-testid="language-switcher-button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 backdrop-blur transition hover:border-pink-300"
            >
              <Globe size={14} />
              {current.short}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 overflow-hidden rounded-2xl glass-card p-1.5"
                  data-testid="language-dropdown"
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      data-testid={`lang-option-${l.code}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        lang === l.code ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {l.label}
                      <span className="text-[10px] opacity-60">{l.short}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            data-testid="nav-quote-button"
            onClick={() => navigate('/contact')}
            className="group flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-pink-600 active:scale-95"
          >
            {t('ctaQuote')}
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>

        <button
          data-testid="mobile-menu-button"
          className="rounded-full border border-slate-200 bg-white/80 p-2.5 backdrop-blur lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 dark-mesh lg:hidden"
            data-testid="mobile-menu"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Logo dark />
              <button
                data-testid="mobile-menu-close"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/20 p-2.5 text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-2 px-8">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.path}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.4 }}
                >
                  <NavLink
                    to={l.path}
                    onClick={() => setOpen(false)}
                    data-testid={`mobile-nav-${l.key.toLowerCase()}`}
                    className="font-display block py-3 text-4xl font-extrabold tracking-tight text-white/90 transition hover:text-pink-400"
                  >
                    {t(l.key)}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-8 flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    data-testid={`mobile-lang-${l.code}`}
                    onClick={() => setLang(l.code)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold ${
                      lang === l.code ? 'border-pink-500 bg-pink-500 text-white' : 'border-white/20 text-white/70'
                    }`}
                  >
                    {l.short}
                  </button>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
