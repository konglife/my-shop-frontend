import apiClient from './apiClient';
import { buildStrapiQuery } from '@/utils/strapiQueryBuilder';
import type { Sale } from '@/types/sale';
import type { StrapiResponse, StrapiEntity, StrapiRequestData } from '@/types/strapi';

export interface SaleItemPayload {
  id?: number; // Strapi's component ID
  product: string; // documentId of the product
  quantity: number;
}

export interface SalePayload {
  customer?: string | null; // documentId of the customer
  status_sale: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
  sale_items: SaleItemPayload[];
}

export async function getSales(): Promise<StrapiResponse<StrapiEntity<Sale>[]>> {
  const query = buildStrapiQuery({ populate: ['customer'] });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Sale>[]>>(`/api/sales?${query}`);
  return response.data;
}

export async function getSale(documentId: string): Promise<StrapiResponse<StrapiEntity<Sale>>> {
  const query = buildStrapiQuery({ 
    populate: { 
      customer: true,
      sale_items: {
        populate: ['product']
      }
    }
  });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Sale>>>(`/api/sales/${documentId}?${query}`);
  return response.data;
}

export async function createSale(payload: SalePayload): Promise<StrapiResponse<StrapiEntity<Sale>>> {
  const requestPayload: StrapiRequestData<SalePayload> = { data: payload };
  const response = await apiClient.post<StrapiResponse<StrapiEntity<Sale>>>('/api/sales', requestPayload);
  return response.data;
}

export async function updateSale(documentId: string, payload: SalePayload): Promise<StrapiResponse<StrapiEntity<Sale>>> {
  const requestPayload: StrapiRequestData<SalePayload> = { data: payload };
  const response = await apiClient.put<StrapiResponse<StrapiEntity<Sale>>>(`/api/sales/${documentId}`, requestPayload);
  return response.data;
}

export async function deleteSale(documentId: string): Promise<void> {
  await apiClient.delete(`/api/sales/${documentId}`);
}
