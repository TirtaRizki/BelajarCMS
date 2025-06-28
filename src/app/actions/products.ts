
'use server';

import type { ProductItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';
import { revalidatePath } from 'next/cache';

// The live API endpoint for fetching products is returning a 404 Not Found error.
// To unblock development, we will use a mock in-memory store for all product
// actions for the duration of the server session. Once the backend endpoint is
// confirmed to be working, this mock implementation can be replaced with real API calls.
let mockProductStore: ProductItem[] = [
    {
        id: 'prod_1',
        name: 'Keripik Pisang Original',
        price: 15000,
        description: 'Keripik pisang renyah dengan rasa original yang otentik.',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'prod_2',
        name: 'Keripik Singkong Balado',
        price: 12000,
        description: 'Keripik singkong pedas dengan bumbu balado khas.',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
];

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction (Mock)');
  // This is a mock implementation as the API is returning 404.
  await new Promise(resolve => setTimeout(resolve, 50)); 
  // Return a sorted copy
  return { success: true, data: [...mockProductStore].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function addProductAction(
  newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: addProductAction (Mock) for', newProductData.name);
  const token = getAuthToken();
  // We'll keep the token check to simulate a protected action
  if (!token) return { success: false, error: "Not authenticated (mock check)." };

  await new Promise(resolve => setTimeout(resolve, 50));

  const newProduct: ProductItem = {
    id: `prod_${crypto.randomUUID()}`,
    ...newProductData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockProductStore.unshift(newProduct);
  
  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/analytics');
  return { success: true, data: newProduct };
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: updateProductAction (Mock) for ID', productId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated (mock check)." };

  await new Promise(resolve => setTimeout(resolve, 50));
  
  const itemIndex = mockProductStore.findIndex(item => String(item.id) === productId);
  if (itemIndex === -1) {
    return { success: false, error: "Product not found." };
  }
  
  mockProductStore[itemIndex] = { 
    ...mockProductStore[itemIndex], 
    ...updates,
    updatedAt: new Date(),
  };

  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/analytics');
  return { success: true, data: mockProductStore[itemIndex] };
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteProductAction (Mock) for ID', productId);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated (mock check)." };

  await new Promise(resolve => setTimeout(resolve, 50));

  const initialLength = mockProductStore.length;
  mockProductStore = mockProductStore.filter(item => String(item.id) !== productId);
  
  if (mockProductStore.length === initialLength) {
     return { success: false, error: "Product not found for deletion." };
  }
  
  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/analytics');
  return { success: true };
}
