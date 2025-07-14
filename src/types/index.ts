// Re-export all types from individual files
export * from './attendance';
export * from './calender';


// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  course?: string;
  year?: number;
  createdAt: string;
  updatedAt: string;
}
