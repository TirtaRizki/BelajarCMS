
export interface ImageItem {
  id: string;
  dataUri: string;
  name: string;
  price: string; // Price can be "Not set" or a monetary value e.g., "$19.99"
  tags: string[];
  uploadedAt: Date;
}

export interface TestimonialItem {
  id: string;
  author: string;
  quote: string;
  createdAt: Date;
}

