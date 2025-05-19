
export interface User {
  id: string; // Typically string (e.g., CUID, UUID) or number from DB
  username: string;
  email: string;
  displayName: string;
  role: 'admin' | 'author' | 'operator';
  // passwordHash?: string; // Only on server, never send to client
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ImageItem {
  id: string; // Typically string or number from DB
  dataUri: string; // For display; consider storing URL if files are hosted
  name: string;
  price: string; // e.g., "150000" or "Not set"
  uploadedAt: Date;
  // userId?: string; // Optional: if images are associated with users
}

export interface TestimonialItem {
  id: string; // Typically string or number from DB
  author: string;
  quote: string;
  createdAt: Date;
  // userId?: string; // Optional: if testimonials are associated with users
}

// Generic type for server action responses
export type ServerActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string | { [key: string]: string[] } | null; // Can be a simple string or Zod-like error object
};
