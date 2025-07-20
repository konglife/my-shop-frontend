import apiClient from './apiClient';
import { buildStrapiQuery } from '@/utils/strapiQueryBuilder';
import type { Category } from '@/types/category'; // Note: We will need to create this type
import type { StrapiResponse, StrapiEntity, StrapiRequestData } from '@/types/strapi';

/**
 * Fetches all categories from the API.
 */
export async function getCategories(): Promise<StrapiResponse<StrapiEntity<Category>[]>> {
  const queryString = buildStrapiQuery({ populate: '*' });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Category>[]>>(`/api/categories?${queryString}`);
  return response.data;
}

/**
 * Creates a new category.
 * @param categoryData - The data for the new category.
 */
export async function createCategory(categoryData: Category): Promise<StrapiResponse<StrapiEntity<Category>>> {
  const requestPayload: StrapiRequestData<Category> = { data: categoryData };
  const response = await apiClient.post<StrapiResponse<StrapiEntity<Category>>>(`/api/categories`, requestPayload);
  return response.data;
}

/**
 * Updates an existing category.
 * @param documentId - The document ID of the category to update.
 * @param categoryData - The new data for the category.
 */
export async function updateCategory(documentId: string, categoryData: Partial<Category>): Promise<StrapiResponse<StrapiEntity<Category>>> {
  const requestPayload: StrapiRequestData<Partial<Category>> = { data: categoryData };
  const response = await apiClient.put<StrapiResponse<StrapiEntity<Category>>>(`/api/categories/${documentId}`, requestPayload);
  return response.data;
}

/**
 * Deletes a category.
 * @param documentId - The document ID of the category to delete.
 */
export async function deleteCategory(documentId: string): Promise<void> {
  await apiClient.delete(`/api/categories/${documentId}`);
}

