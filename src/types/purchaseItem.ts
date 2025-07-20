import type { StrapiEntity, StrapiRelation } from './strapi';
import type { Purchase } from './purchase';
import type { Product } from './product';

export interface PurchaseItem {
  quantity: number;
  unit_price: number;
  purchase?: StrapiRelation<StrapiEntity<Purchase>>;
  product?: StrapiRelation<StrapiEntity<Product>>;
}
