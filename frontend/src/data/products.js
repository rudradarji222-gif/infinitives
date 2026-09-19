import { productCatalogue as base } from './catalogueData';

const CATEGORY_IDS = [
  'gummy-candy', 'effervescent-tablets', 'orthopedic', 'immunity-multivitamin', 'ophthal',
  'gynec', 'derma', 'infertility-pcos', 'brain-neuro', 'uti', 'cardiac', 'liver',
  'protein', 'pediatric', 'gastrointestinal',
];

const imageMap = Object.fromEntries(CATEGORY_IDS.map((id) => [id, `/assets/categories/${id}.webp`]));

export const productCatalogue = base.map((c) => ({ ...c, image: imageMap[c.id] }));

export const productCategoriesShort = productCatalogue.map((c) => ({
  id: c.id,
  name: c.name,
  tagline: c.tagline,
  image: c.image,
  description: c.description,
  count: c.products.length,
}));

export const totalProducts = productCatalogue.reduce((sum, c) => sum + c.products.length, 0);
