export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export type ErrorType =
  | 'UNAUTHORIZED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AppError {
  type: ErrorType;
  message: string;
  field?: string;
}
