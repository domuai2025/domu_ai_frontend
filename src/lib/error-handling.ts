export class AppError extends Error {
  public code: string;
  public metadata?: Record<string, unknown>;

  constructor(message: string, code: string, metadata?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.metadata = metadata;
    this.name = 'AppError';
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}

export function handleError(error: unknown): AppError {
  if (AppError.isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', {
      originalError: error,
    });
  }

  return new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    { originalError: error }
  );
}

export function createErrorMessage(error: unknown): string {
  const appError = handleError(error);

  switch (appError.code) {
    case 'AUTHENTICATION_ERROR':
      return 'Please sign in to continue';
    case 'AUTHORIZATION_ERROR':
      return 'You do not have permission to perform this action';
    case 'VALIDATION_ERROR':
      return 'Please check your input and try again';
    case 'NETWORK_ERROR':
      return 'Unable to connect to the server. Please check your internet connection';
    case 'API_ERROR':
      return 'Something went wrong with the request. Please try again later';
    default:
      return appError.message || 'An unexpected error occurred';

  }
}