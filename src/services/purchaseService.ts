import apiClient from './apiClient';
import { buildStrapiQuery } from '@/utils/strapiQueryBuilder';
import type { Purchase } from '@/types/purchase';
import type { PurchaseItem } from '@/types/purchaseItem';
import type { StrapiResponse, StrapiEntity, StrapiRequestData } from '@/types/strapi';

// Payload for creating/updating a PurchaseItem (linking to product by documentId)
export interface PurchaseItemPayload {
  id?: number; // Strapi's component ID
  product: string; // documentId of the product
  quantity: number;
  unit_price: number;
}

// Payload for creating/updating a Purchase
export interface PurchasePayload {
  supplier: string; // documentId of the supplier
  order_date?: string;
  received_date?: string;
  status_purchase: 'PENDING' | 'RECEIVED' | 'CANCELLED';
  purchase_items: PurchaseItemPayload[];
}

/**
 * Fetches all purchases from the API.
 */
export async function getPurchases(): Promise<StrapiResponse<StrapiEntity<Purchase>[]>> {
  const queryString = buildStrapiQuery({ 
    populate: ['supplier']
  });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Purchase>[]>>(`/api/purchases?${queryString}`);
  return response.data;
}

/**
 * Fetches a single purchase by its document ID.
 */
export async function getPurchase(documentId: string): Promise<StrapiResponse<StrapiEntity<Purchase>>> {
  const queryString = buildStrapiQuery({
    populate: { 
      supplier: true,
      purchase_items: {
        populate: ['product']
      }
    }
  });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Purchase>>>(`/api/purchases/${documentId}?${queryString}`);
  return response.data;
}

/**
 * Creates a new purchase.
 */
export async function createPurchase(purchaseData: Partial<PurchasePayload>): Promise<StrapiResponse<StrapiEntity<Purchase>>> {
  const requestPayload: StrapiRequestData<Partial<PurchasePayload>> = { data: purchaseData };
  const response = await apiClient.post<StrapiResponse<StrapiEntity<Purchase>>>(`/api/purchases`, requestPayload);
  return response.data;
}

/**
 * Updates an existing purchase.
 */
export async function updatePurchase(documentId: string, purchaseData: Partial<PurchasePayload>): Promise<StrapiResponse<StrapiEntity<Purchase>>> {
  const requestPayload: StrapiRequestData<Partial<PurchasePayload>> = { data: purchaseData };
  const response = await apiClient.put<StrapiResponse<StrapiEntity<Purchase>>>(`/api/purchases/${documentId}`, requestPayload);
  return response.data;
}

/**
 * Deletes a purchase.
 */
export async function deletePurchase(documentId: string): Promise<void> {
  await apiClient.delete(`/api/purchases/${documentId}`);
}
