
export interface User {
  id: string | number; 
  username: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'AUTHOR' | 'OPERATOR'; // Changed to uppercase to match API
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface MediaItem {
  id: string;
  url: string; 
  name: string;
  altText?: string;
  uploadedAt: Date | string;
}

export interface TestimonialItem {
  id: string | number;
  author: string;
  quote: string;
  createdAt: Date | string;
}

export interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  author: string;
  category: string;
  publishedAt: Date | string;
  imageUrl?: string;
}

export interface ArticleItem {
  id: string | number;
  title: string;
  content: string; 
  author: string;
  category: string;
  tags?: string[];
  publishedAt: Date | string;
  imageUrl?: string;
}

export interface ProductItem {
  id: string | number;
  name: string;
  price: number;
  description?: string | null;
  image: string;
  category: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type ServerActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string | { [key: string]: string[] } | null;
};
