
'use server';

import type { ProductItem, ServerActionResponse, ApiResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { getAuthToken } from '@/lib/api-helpers';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

// In-memory store for offline/mock mode
let mockProductStore: ProductItem[] = [
    {
        id: 'prod_1',
        name: 'Keripik Pisang Original (Contoh)',
        price: 15000,
        description: 'Rasa original yang renyah dan gurih, dibuat dari pisang pilihan.',
        image: 'https://placehold.co/600x400.png',
        category: 'Keripik',
        createdAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
        updatedAt: new Date(new Date().setDate(new Date().getDate()-2)).toISOString(),
    },
];

async function fetchProductsFromApi(): Promise<ServerActionResponse<ProductItem[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
    if (!response.ok) {
        return { success: false, error: `Failed to fetch products. Status: ${response.status}` };
    }
    const result: ApiResponse<ProductItem[]> = await response.json();
    return { success: result.success, data: result.data, error: result.message };
  } catch (error) {
    console.warn("API connection failed, falling back to mock data for products.", error);
    return { success: false, error: 'API_OFFLINE' };
  }
}

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  const apiResult = await fetchProductsFromApi();
  if (apiResult.success) {
    return apiResult;
  }
  // Fallback to mock data if API fails
  console.log('Server Action: fetchProductsAction (Fallback to Mock)');
  return { success: true, data: [...mockProductStore].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
}

export async function addProductAction(
  newProductData: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServerActionResponse<ProductItem>> {
  const token = getAuthToken();
  if (!token) {
    console.log('Server Action: addProductAction (Mock - No Token)');
    const newProduct: ProductItem = {
      ...newProductData, id: `prod_${crypto.randomUUID()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    mockProductStore.unshift(newProduct);
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true, data: newProduct };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newProductData),
      cache: 'no-store',
    });
    const result: ApiResponse<ProductItem> = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || 'Failed to add product via API.' };
    }
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: 'Could not connect to the backend to add product.' };
  }
}

export async function updateProductAction(
  productId: string,
  updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerActionResponse<ProductItem>> {
  const token = getAuthToken();
   if (!token) {
    console.log('Server Action: updateProductAction (Mock - No Token)');
    const productIndex = mockProductStore.findIndex(p => String(p.id) === productId);
    if (productIndex === -1) return { success: false, error: "Product not found in mock store." };
    mockProductStore[productIndex] = { ...mockProductStore[productIndex], ...updates, updatedAt: new Date().toISOString() };
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true, data: mockProductStore[productIndex] };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updates),
      cache: 'no-store',
    });
    const result: ApiResponse<ProductItem> = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || 'Failed to update product via API.' };
    }
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: 'Could not connect to the backend to update product.' };
  }
}

export async function deleteProductAction(productId: string): Promise<ServerActionResponse> {
  const token = getAuthToken();
  if (!token) {
    console.log('Server Action: deleteProductAction (Mock - No Token)');
    const initialLength = mockProductStore.length;
    mockProductStore = mockProductStore.filter(p => String(p.id) !== productId);
    if (mockProductStore.length === initialLength) return { success: false, error: "Product not found for deletion in mock store." };
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    const result: ApiResponse<null> = await response.json();
    if (!result.success) {
      return { success: false, error: result.message || 'Failed to delete product via API.' };
    }
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Could not connect to the backend to delete product.' };
  }
}
