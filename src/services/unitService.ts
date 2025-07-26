import apiClient from './apiClient';
import { buildStrapiQuery } from '@/utils/strapiQueryBuilder';
import type { Unit } from '@/types/unit';
import type { StrapiResponse, StrapiEntity, StrapiRequestData } from '@/types/strapi';

/**
 * Fetches a single unit by its document ID.
 * @param documentId - The document ID of the unit to fetch.
 */
export async function getUnit(documentId: string): Promise<StrapiResponse<StrapiEntity<Unit>>> {
  const query = buildStrapiQuery({ populate: '*' });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Unit>>>(`/api/units/${documentId}?${query}`);
  return response.data;
}

/**
 * Fetches all units from the API.
 */
export async function getUnits(): Promise<StrapiResponse<StrapiEntity<Unit>[]>> {
  const query = buildStrapiQuery({ populate: '*' });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Unit>[]>>(`/api/units?${query}`);
  return response.data;
}

/**
 * Creates a new unit.
 * @param unitData - The data for the new unit.
 */
export async function createUnit(unitData: Unit): Promise<StrapiResponse<StrapiEntity<Unit>>> {
  const requestPayload: StrapiRequestData<Unit> = { data: unitData };
  const response = await apiClient.post<StrapiResponse<StrapiEntity<Unit>>>(`/api/units`, requestPayload);
  return response.data;
}

/**
 * Updates an existing unit.
 * @param documentId - The document ID of the unit to update.
 * @param unitData - The new data for the unit.
 */
export async function updateUnit(documentId: string, unitData: Partial<Unit>): Promise<StrapiResponse<StrapiEntity<Unit>>> {
  const requestPayload: StrapiRequestData<Partial<Unit>> = { data: unitData };
  const response = await apiClient.put<StrapiResponse<StrapiEntity<Unit>>>(`/api/units/${documentId}`, requestPayload);
  return response.data;
}

/**
 * Deletes a unit.
 * @param documentId - The document ID of the unit to delete.
 */
export async function deleteUnit(documentId: string): Promise<void> {
  await apiClient.delete(`/api/units/${documentId}`);
}
