
export interface User {
  id: string; 
  username: string;
  email: string;
  displayName: string;
  role: 'admin' | 'author' | 'operator';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MediaItem {
  id: string;
  url: string; // dataUri for mock, actual URL in production
  name: string;
  altText?: string;
  uploadedAt: Date;
}

export interface TestimonialItem {
  id: string;
  author: string;
  quote: string;
  createdAt: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  publishedAt: Date;
  imageUrl?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  content: string; 
  author: string;
  category: string;
  tags?: string[];
  publishedAt: Date;
  imageUrl?: string;
}

export type ServerActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string | { [key: string]: string[] } | null;
};
