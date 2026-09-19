import { productCatalogue as base } from './catalogueData';
import { images } from './content';

const imageMap = {
  'gummy-candy': images.gummies,
  'effervescent-tablets': images.tablets,
  'orthopedic': images.capsules,
  'immunity-multivitamin': images.tablets,
  'ophthal': images.softgels,
  'gynec': images.capsules,
  'derma': images.softgels,
  'infertility-pcos': images.capsules,
  'brain-neuro': images.tablets,
  'uti': images.hero,
  'cardiac': images.softgels,
  'liver': images.hero,
  'protein': images.powders,
  'pediatric': images.gummies,
  'gastrointestinal': images.capsules,
};

export const productCatalogue = base.map((c) => ({ ...c, image: imageMap[c.id] || images.tablets }));

export const productCategoriesShort = productCatalogue.map((c) => ({
  id: c.id,
  name: c.name,
  tagline: c.tagline,
  image: c.image,
  description: c.description,
  count: c.products.length,
}));

export const totalProducts = productCatalogue.reduce((sum, c) => sum + c.products.length, 0);
