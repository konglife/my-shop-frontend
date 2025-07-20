import type { StrapiEntity, StrapiRelation } from './strapi';
import type { Customer } from './customer';
// import type { UsedPart } from './usedPart'; // To be created

export interface RepairJob {
  name: string;
  description?: string;
  status_repair: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  total_cost: number;
  customer?: StrapiRelation<StrapiEntity<Customer>>;
  // used_parts?: StrapiRelation<StrapiEntity<UsedPart>[]>;
}
