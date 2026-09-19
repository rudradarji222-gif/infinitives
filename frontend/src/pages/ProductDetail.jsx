import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, FlaskConical } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { productCatalogue } from '../data/products';

const ProductDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = productCatalogue.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5" data-testid="category-not-found">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Category not found</h1>
        <Link to="/products" data-testid="back-to-products-link" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main data-testid="product-detail-page">
      <section className="hero-mesh relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <Link to="/products" data-testid="back-to-products-link" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 transition hover:text-pink-600">
              <ArrowLeft size={14} /> All categories
            </Link>
          </Reveal>
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Reveal delay={0.05}>
                <span className="glass-card rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
                  {category.products.length} formulations
                </span>
              </Reveal>
              <Reveal delay={0.12}>
                <h1 className="font-display mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl" data-testid="category-title">
                  {category.name}
                </h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-4 max-w-xl leading-relaxed text-slate-600">{category.description}</p>
              </Reveal>
              <Reveal delay={0.28}>
                <button
                  data-testid="category-quote-button"
                  onClick={() => navigate('/contact')}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-pink-600 active:scale-95"
                >
                  Request bulk quote <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
                </button>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <img src={category.image} alt={category.name} className="h-72 w-full rounded-[2.5rem] object-cover shadow-2xl shadow-slate-900/15" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" data-testid="category-products-table-section">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
          <div className="hidden grid-cols-[2fr_2fr_1fr] gap-4 border-b border-slate-100 bg-[#f8fafc] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:grid">
            <span>Formulation</span><span>Key ingredients</span><span>Dosage form</span>
          </div>
          {category.products.map((p, i) => (
            <Reveal key={p.name} delay={Math.min(i * 0.02, 0.3)} y={12}>
              <div className="grid gap-2 border-b border-slate-50 px-8 py-5 transition hover:bg-pink-50/40 sm:grid-cols-[2fr_2fr_1fr] sm:items-center sm:gap-4" data-testid={`product-row-${i}`}>
                <span className="flex items-center gap-3 text-sm font-bold text-slate-900">
                  <FlaskConical size={15} className="shrink-0 text-pink-500" /> {p.name}
                </span>
                <span className="text-xs leading-relaxed text-slate-500">{p.ingredients}</span>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">{p.form}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          Every formulation is fully customizable — strengths, flavors, packaging and private labeling on request.
        </p>
      </section>
    </main>
  );
};

export default ProductDetail;
