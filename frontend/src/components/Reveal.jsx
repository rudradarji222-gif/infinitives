import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, y = 36, className = '', once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: '-80px' }}
    transition={{ duration: 0.85, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const MaskedLine = ({ children, delay = 0, className = '' }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: '112%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

export const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.1, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ overline, title, sub, dark = false, align = 'center' }) => (
  <div className={`mb-14 ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}`}>
    <Reveal>
      <span className="text-xs font-bold uppercase tracking-[0.24em] text-pink-600">{overline}</span>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 className={`font-display mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
    </Reveal>
    {sub && (
      <Reveal delay={0.16}>
        <p className={`mt-5 text-base leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{sub}</p>
      </Reveal>
    )}
  </div>
);
