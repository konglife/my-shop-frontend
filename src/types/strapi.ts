export interface StrapiEntity<T> {
  id: number;
  documentId: string;
  attributes: T;
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
