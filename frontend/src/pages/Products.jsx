import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PageHero } from './About';
import { useLang } from '../i18n/LanguageContext';
import { productCategoriesShort, totalProducts } from '../data/products';

const ACCENTS = ['#e91e63', '#0284c7', '#f59e0b'];

const Products = () => {
  const { t } = useLang();
  return (
    <main data-testid="products-page">
      <PageHero overline={t('navProducts')} title={t('productsPageTitle')} sub={t('productsPageSub')} />

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8" data-testid="products-grid-section">
        <Reveal className="mb-10 flex justify-center">
          <span className="glass-card rounded-full px-6 py-2.5 text-sm font-bold text-slate-700" data-testid="products-total-count">
            {totalProducts}+ {t('productsCount')} · 15 categories
          </span>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productCategoriesShort.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.06}>
              <Link
                to={`/products/${c.id}`}
                data-testid={`category-card-${c.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className="absolute bottom-4 left-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white" style={{ backgroundColor: ACCENTS[i % 3] }}>
                    {c.count} {t('productsCount')}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-4 p-6">
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-slate-900">{c.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.tagline}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-all duration-300 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Products;
