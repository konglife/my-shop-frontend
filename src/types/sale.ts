import type { StrapiEntity, StrapiRelation } from './strapi';
import type { Customer } from './customer';
import type { SaleItem } from './saleItem';

export interface Sale {
  total_amount?: number;
  total_cost?: number;
  status_sale: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  customer?: StrapiRelation<StrapiEntity<Customer>>;
  sale_items?: StrapiRelation<StrapiEntity<SaleItem>[]>;

}
