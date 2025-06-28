
// The authenticated user object
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'AUTHOR' | 'OPERATOR' | 'USER';
  createdAt?: string | Date;
  updatedAt?: string | Date;
  password?: string; // Should only be used for creation/update, not stored long-term on client
}

// Represents a product in the catalog
export interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string | null;
  category: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Represents an item in the Media Library (mocked)
export interface MediaItem {
  id: string;
  url: string; 
  name: string;
  altText?: string;
  uploadedAt: string | Date;
}

// Represents the top-level response structure from the backend API
export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  token?: string; // For JWT response
};

// Represents the standardized response from a Server Action
export type ServerActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string | { [key: string]: string[] } | null;
};
