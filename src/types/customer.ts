import type { StrapiEntity, StrapiRelation } from './strapi';
import type { RepairJob } from './repairJob'; // Will be created later
import type { Sale } from './sale'; // Will be created later

export interface Customer {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  repair_jobs?: StrapiRelation<StrapiEntity<RepairJob>[]>;
  sales?: StrapiRelation<StrapiEntity<Sale>[]>;
}
