import type { StrapiEntity, StrapiRelation } from './strapi';
import type { Supplier } from './supplier';
import type { PurchaseItem } from './purchaseItem';

export interface Purchase {
  status_purchase: 'PENDING' | 'RECEIVED' | 'CANCELLED';
  order_date?: string;
  received_date?: string;
  supplier?: StrapiRelation<StrapiEntity<Supplier>>;
  purchase_items?: StrapiRelation<StrapiEntity<PurchaseItem>[]>;
}
