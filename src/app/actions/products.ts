
'use server';

import type { ProductItem, ServerActionResponse } from '@/types';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL;

// The live API does not seem to have product endpoints ready yet (getting 404).
// We will use a mock in-memory store for these actions to keep the UI functional
// for the duration of the server session.
let mockProductStore: ProductItem[] = [
    {
        id: 'prod_1',
        name: 'Keripik Pisang Coklat Lumer',
        price: 15000,
        description: 'Keripik pisang renyah dibalut dengan coklat premium yang lumer di mulut. Cemilan sempurna untuk segala suasana.',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(new Date().setDate(new Date().getDate()-5)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-1)).toISOString(),
    },
    {
        id: 'prod_2',
        name: 'Basreng Pedas Daun Jeruk',
        price: 12500,
        description: 'Bakso goreng kering dengan bumbu pedas nampol dan aroma daun jeruk yang khas. Bikin nagih!',
        image: 'https://placehold.co/600x400.png',
        category: 'Cemilan Pedas',
        createdAt: new Date(new Date().setDate(new Date().getDate()-10)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
    }
];


export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction (Mock)');
  // This is a mock implementation
  await new Promise(resolve => setTimeout(resolve, 50));
  return { success: true, data: [...mockProductStore].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function addProductAction(
  newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: addProductAction (Mock) for', newProductData.name);
  // This is a mock implementation
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  const newProduct: ProductItem = {
      id: `prod_${crypto.randomUUID()}`,
      ...newProductData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
  };

  mockProductStore.unshift(newProduct);

  return { success: true, data: newProduct };
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: updateProductAction (Mock) for ID', productId);
  // This is a mock implementation
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  const productIndex = mockProductStore.findIndex(p => String(p.id) === String(productId));

  if (productIndex === -1) {
      return { success: false, error: "Product not found." };
  }

  mockProductStore[productIndex] = {
      ...mockProductStore[productIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
  };

  return { success: true, data: mockProductStore[productIndex] };
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  console.log('Server Action: deleteProductAction (Mock) for ID', productId);
  // This is a mock implementation
  await new Promise(resolve => setTimeout(resolve, 50));

  const token = getAuthToken();
  if (!token) return { success: false, error: "Not authenticated." };

  const initialLength = mockProductStore.length;
  mockProductStore = mockProductStore.filter(p => String(p.id) !== String(productId));

  if (mockProductStore.length === initialLength) {
      return { success: false, error: "Product not found for deletion." };
  }

  return { success: true };
}
