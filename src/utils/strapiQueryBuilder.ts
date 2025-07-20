import { stringify } from 'qs';

export interface StrapiQueryParams {
  sort?: string | string[];
  filters?: Record<string, any>;
  populate?: string | string[] | Record<string, any>;
  fields?: string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  publicationState?: 'live' | 'preview';
}

/**
 * Builds a Strapi query string from a parameter object.
 * @param params - The query parameters.
 * @returns A URL query string.
 */
export function buildStrapiQuery(params: StrapiQueryParams): string {
  return stringify(params, { encodeValuesOnly: true });
}
