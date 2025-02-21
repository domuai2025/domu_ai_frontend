export interface ApiResponse<T> {
  data: T;
  error: null | {
    message: string;
    code: string;
  };
}

export function isApiError(response: unknown): response is ApiResponse<never> {
  return typeof response === 'object' && 
    response !== null && 
    'error' in response && 
    response.error !== null;
} 