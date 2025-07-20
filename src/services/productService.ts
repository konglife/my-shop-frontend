import apiClient from './apiClient';
import { buildStrapiQuery } from '@/utils/strapiQueryBuilder';
import type { Product } from '@/types/product';
import type { StrapiResponse, StrapiEntity, StrapiRequestData } from '@/types/strapi';

/**
 * Type for the payload when creating or updating a product.
 * We send the documentId for the relations.
 */
export interface ProductPayload {
  name: string;
  selling_price: number;
  description?: any;
  category?: string; // documentId
  unit?: string;     // documentId
}

/**
 * Fetches all products from the API, populating related data.
 */
export async function getProducts(): Promise<StrapiResponse<StrapiEntity<Product>[]>> {
  const queryString = buildStrapiQuery({ populate: ['category', 'unit', 'stock'] });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Product>[]>>(`/api/products?${queryString}`);
  return response.data;
}

/**
 * Creates a new product.
 * @param productData - The data for the new product.
 */
export async function createProduct(productData: ProductPayload): Promise<StrapiResponse<StrapiEntity<Product>>> {
  const requestPayload: StrapiRequestData<ProductPayload> = { data: productData };
  const response = await apiClient.post<StrapiResponse<StrapiEntity<Product>>>(`/api/products`, requestPayload);
  return response.data;
}

/**
 * Updates an existing product.
 * @param documentId - The document ID of the product to update.
 * @param productData - The new data for the product.
 */
export async function updateProduct(documentId: string, productData: Partial<ProductPayload>): Promise<StrapiResponse<StrapiEntity<Product>>> {
  const requestPayload: StrapiRequestData<Partial<ProductPayload>> = { data: productData };
  const response = await apiClient.put<StrapiResponse<StrapiEntity<Product>>>(`/api/products/${documentId}`, requestPayload);
  return response.data;
}

/**
 * Deletes a product.
 * @param documentId - The document ID of the product to delete.
 */
export async function deleteProduct(documentId: string): Promise<void> {
  await apiClient.delete(`/api/products/${documentId}`);
}

