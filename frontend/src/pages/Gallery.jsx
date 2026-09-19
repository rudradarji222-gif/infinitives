import { Reveal } from '../components/Reveal';
import { PageHero } from './About';
import { useLang } from '../i18n/LanguageContext';
import { images } from '../data/content';
import { productCatalogue } from '../data/products';

const facilityShots = [
  { src: images.facility, caption: 'Manufacturing Facility', span: 'sm:col-span-2 sm:row-span-2' },
  { src: images.machinery, caption: 'Automated Production Lines', span: '' },
  { src: images.lab, caption: 'Analytical Laboratory', span: '' },
  { src: images.conveyor, caption: 'Packaging & Dispatch', span: 'sm:col-span-2' },
  { src: images.factoryHall, caption: 'Production Hall', span: '' },
];

const Gallery = () => {
  const { t } = useLang();
  const productShots = productCatalogue.slice(0, 9).map((c) => ({ src: c.image, caption: c.name }));

  return (
    <main data-testid="gallery-page">
      <PageHero overline={t('navGallery')} title={t('galleryPageTitle')} sub={t('galleryPageSub')} />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" data-testid="facility-gallery">
        <Reveal>
          <h2 className="font-display mb-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">The Plant</h2>
        </Reveal>
        <div className="grid auto-rows-[14rem] gap-4 sm:grid-cols-3">
          {facilityShots.map((s, i) => (
            <Reveal key={s.caption} delay={i * 0.05} className={s.span}>
              <figure className="group relative h-full w-full overflow-hidden rounded-[2rem]" data-testid={`facility-shot-${i}`}>
                <img src={s.src} alt={s.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:scale-110" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-5 pt-12 text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {s.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" data-testid="product-gallery">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display mb-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Dosage Formats</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productShots.map((s, i) => (
              <Reveal key={s.caption} delay={(i % 3) * 0.06}>
                <figure className="group relative h-64 overflow-hidden rounded-[2rem]" data-testid={`product-shot-${i}`}>
                  <img src={s.src} alt={s.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-5 pt-12 text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {s.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-slate-400">
            Professional product photography of your own formulations can be arranged as part of our OEM service.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Gallery;
