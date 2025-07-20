import type { StrapiRelation } from './strapi';
import type { Category } from './category';
import type { Unit } from './unit';

/**
 * Represents the attributes of a Stock entity.
 * Note: This is defined locally until a dedicated stock module is created.
 */
export interface Stock {
  quantity: number;
  min_quantity: number;
  average_cost: number;
}

/**
 * Represents the attributes of a Product entity.
 */
export interface Product {
  name: string;
  description: any; // Strapi 'blocks' type is a JSON object
  selling_price: number;

  // Relational fields
  category?: StrapiRelation<Category>;
  unit?: StrapiRelation<Unit>;
  stock?: StrapiRelation<Stock>;
}
