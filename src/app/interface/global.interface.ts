export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data: T;
};

export type IQueryObj = {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  searchTerm?: string;
  fields?: string;
  sortBy?: string;
  sortOrder?: string;
};

export type ISearchFields = string[];
