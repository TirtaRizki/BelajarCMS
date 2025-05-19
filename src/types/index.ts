
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: 'admin' | 'author' | 'operator'; // Define possible roles
}

export interface ImageItem {
  id: string;
  dataUri: string;
  name: string;
  price: string; // Price can be "Not set" or a monetary value e.g., "$19.99"
  tags: string[]; // Will default to empty if AI is removed
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
  imageUrl?: string; // Optional image URL for the news
  category: string;
  publishedAt: Date;
}

export interface ArticleItem {
  id: string;
  title: string;
  body: string; // Main content of the article
  author: string;
  coverImageUrl?: string; // Optional cover image
  createdAt: Date;
  tags: string[]; // Tags for the article
}
