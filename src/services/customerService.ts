import apiClient from './apiClient';
import { buildStrapiQuery } from '@/utils/strapiQueryBuilder';
import type { Customer } from '@/types/customer';
import type { StrapiResponse, StrapiEntity, StrapiRequestData } from '@/types/strapi';

export type CustomerPayload = Omit<Customer, 'repair_jobs' | 'sales'>;

/**
 * Fetches all customers from the API.
 */
export async function getCustomers(): Promise<StrapiResponse<StrapiEntity<Customer>[]>> {
  // We can add populate logic here later if needed, e.g., for sales history preview
  const queryString = buildStrapiQuery({ /* populate: [...] */ });
  const response = await apiClient.get<StrapiResponse<StrapiEntity<Customer>[]>>(`/api/customers?${queryString}`);
  return response.data;
}

/**
 * Creates a new customer.
 * @param customerData - The data for the new customer.
 */
export async function createCustomer(customerData: CustomerPayload): Promise<StrapiResponse<StrapiEntity<Customer>>> {
  const requestPayload: StrapiRequestData<CustomerPayload> = { data: customerData };
  const response = await apiClient.post<StrapiResponse<StrapiEntity<Customer>>>(`/api/customers`, requestPayload);
  return response.data;
}

/**
 * Updates an existing customer.
 * @param documentId - The document ID of the customer to update.
 * @param customerData - The new data for the customer.
 */
export async function updateCustomer(documentId: string, customerData: Partial<CustomerPayload>): Promise<StrapiResponse<StrapiEntity<Customer>>> {
  const requestPayload: StrapiRequestData<Partial<CustomerPayload>> = { data: customerData };
  const response = await apiClient.put<StrapiResponse<StrapiEntity<Customer>>>(`/api/customers/${documentId}`, requestPayload);
  return response.data;
}

/**
 * Deletes a customer.
 * @param documentId - The document ID of the customer to delete.
 */
export async function deleteCustomer(documentId: string): Promise<void> {
  await apiClient.delete(`/api/customers/${documentId}`);
}
