export interface StrapiEntity<T> {
  id: string; // This is the documentId (string) from Strapi v5
  attributes: T & {
    // Optional legacy numeric id, if it exists in your content type
    id?: number; 
  };
}

export interface StrapiRelation<T> {
  data: StrapiEntity<T> | null;
}

export interface StrapiCollection<T> {
  data: StrapiEntity<T>[];
}

export interface StrapiRequestData<T> {
  data: T;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
