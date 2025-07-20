import apiClient from './apiClient';
import { buildStrapiQuery } from '@/utils/strapiQueryBuilder';
import type { Supplier } from '@/types/supplier';
import type { StrapiResponse, StrapiEntity, StrapiRequestData } from '@/types/strapi';

export type SupplierPayload = Omit<Supplier, 'purchases'>;

/**
 * Fetches all suppliers from the API.
 */
export async function getSuppliers(): Promise<StrapiResponse<StrapiEntity<Supplier>[]>> {
  const queryString = buildStrapiQuery({ /* populate: ['purchases'] */ });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Supplier>[]>>(`/api/suppliers?${queryString}`);
  return response.data;
}

/**
 * Creates a new supplier.
 * @param supplierData - The data for the new supplier.
 */
export async function createSupplier(supplierData: SupplierPayload): Promise<StrapiResponse<StrapiEntity<Supplier>>> {
  const requestPayload: StrapiRequestData<SupplierPayload> = { data: supplierData };
  const response = await apiClient.post<StrapiResponse<StrapiEntity<Supplier>>>(`/api/suppliers`, requestPayload);
  return response.data;
}

/**
 * Updates an existing supplier.
 * @param documentId - The document ID of the supplier to update.
 * @param supplierData - The new data for the supplier.
 */
export async function updateSupplier(documentId: string, supplierData: Partial<SupplierPayload>): Promise<StrapiResponse<StrapiEntity<Supplier>>> {
  const requestPayload: StrapiRequestData<Partial<SupplierPayload>> = { data: supplierData };
  const response = await apiClient.put<StrapiResponse<StrapiEntity<Supplier>>>(`/api/suppliers/${documentId}`, requestPayload);
  return response.data;
}

/**
 * Deletes a supplier.
 * @param documentId - The document ID of the supplier to delete.
 */
export async function deleteSupplier(documentId: string): Promise<void> {
  await apiClient.delete(`/api/suppliers/${documentId}`);
}
