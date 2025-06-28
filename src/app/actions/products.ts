
'use server';

import type { ProductItem, ServerActionResponse, ApiResponse } from '@/types';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_BASE_URL = 'http://localhost:3001/api/products'; // Your backend API endpoint

// Helper to get the auth token from cookies
const getAuthToken = (): string | undefined => cookies().get('token')?.value;

export async function fetchProductsAction(): Promise<ServerActionResponse<ProductItem[]>> {
  console.log('Server Action: fetchProductsAction (Real API)');
  try {
    const response = await fetch(API_BASE_URL, {
      cache: 'no-store', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to fetch products: ${response.statusText}` }));
      return { success: false, error: errorData.message };
    }

    const result: ApiResponse<ProductItem[]> = await response.json();
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while fetching products.' };
  }
}

export async function addProductAction(newProduct: Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServerActionResponse<ProductItem>> {
  console.log('Server Action: addProductAction for', newProduct.name);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Authentication token not found." };
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to add product: ${response.statusText}` }));
      return { success: false, error: errorData.message };
    }

    const result: ApiResponse<ProductItem> = await response.json();
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the product.' };
  }
}

export async function updateProductAction(productId: number, updates: Partial<Omit<ProductItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ServerActionResponse<ProductItem>> {
  console.log(`Server Action: updateProductAction for ID ${productId}`);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Authentication token not found." };
  
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to update product: ${response.statusText}` }));
      return { success: false, error: errorData.message };
    }

    const result: ApiResponse<ProductItem> = await response.json();
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error(`Error updating product ${productId}:`, error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating the product.' };
  }
}

export async function deleteProductAction(productId: number): Promise<ServerActionResponse> {
  console.log(`Server Action: deleteProductAction for ID ${productId}`);
  const token = getAuthToken();
  if (!token) return { success: false, error: "Authentication token not found." };

  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Failed to delete product: ${response.statusText}` }));
      return { success: false, error: errorData.message };
    }

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/analytics');
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting product ${productId}:`, error);
    return { success: false, error: error.message || 'An unexpected error occurred while deleting the product.' };
  }
}
