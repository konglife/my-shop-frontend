import type { StrapiRelation, StrapiEntity } from './strapi';
import type { Purchase } from './purchase'; // Will be created later

export interface Supplier {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  purchases?: StrapiRelation<StrapiEntity<Purchase>[]>;
}
