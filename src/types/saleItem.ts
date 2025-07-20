import type { StrapiEntity, StrapiRelation } from './strapi';
import type { Sale } from './sale';
import type { Product } from './product';

export interface SaleItem {
  quantity: number;
  price_at_time?: number;
  cost_at_time?: number;
  sale?: StrapiRelation<StrapiEntity<Sale>>;
  product?: StrapiRelation<StrapiEntity<Product>>;
}
