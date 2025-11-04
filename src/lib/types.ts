export type PaginationParams = {
  limit: number;
  offset: number;
};

export type PaginationValidationResult = {
  isValid: boolean;
  params?: PaginationParams;
  error?: string;
};

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data?: T;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
